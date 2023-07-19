import { Worker, Job } from 'bullmq'

import { BullMQWorker, type PubSub, RedisPubSubWrapper, app } from '@magickml/server-core'
import { Agent, AgentManager, type AgentUpdateJob, type AgentRunJob } from '@magickml/agents'
import { v4 as uuidv4 } from 'uuid'
import { AGENT_DELETE } from '@magickml/core'

export interface AgentListRecord {
  id: string
  currentAgents: string[]
}

// I get that it's confusing extending AgentManager, but it's the best way to
// get the functionality I want without having to rewrite a bunch of stuff.
// Agent Managers just managed agents for a single instance of the server anyway
export class CloudAgentWorker extends AgentManager {
  pubSub: PubSub

  constructor() {
    super(app, false)

    this.pubSub = app.get('pubsub')

    this.pubSub.subscribe(AGENT_DELETE, async (agentId: string) => {
      this.logger.info(`Agent ${agentId} deleted, removing from cloud agent worker`)
      await this.removeAgent(agentId)
    })

    this.heartbeat()
  }

  heartbeat() {
    new Worker('cloud-agents:ping', async () => {
      this.pubSub.publish('cloud-agents:pong', JSON.stringify({
        id: uuidv4(),
        currentAgents: Object.keys(this.currentAgents),
      }))
    })
  }

  async addAgent(agentId: string) {
    this.logger.info(`Creating agent ${agentId}...`)
    const agentDBResult = (
      await app.service('agents').find({
        query: {
          id: agentId,
        },
      })
    )?.data

    if (agentDBResult.length == 0 || !agentDBResult) {
      this.logger.error(`Agent ${agentId} not found when creating agent`)
      throw new Error(`Agent ${agentId} not found when creating agent`)
    }

    const agentData = {
      ...agentDBResult[0],
      pingedAt: new Date().toISOString(),
    }

    if (!agentData.enabled) {
      this.logger.info(`Agent ${agentId} is disabled, skipping creation`)
      return
    }

    const agent = new Agent(
      agentData,
      this,
      new BullMQWorker(),
      new RedisPubSubWrapper(),
    )

    this.logger.debug(`Running agent add handlers for ${agentId}`)
    this.addHandlers.forEach(handler => {
      handler({ agent, agentData })
    })

    this.currentAgents[agentId] = agent
    this.logger.debug(`Finished running agent add handlers for ${agentId}`)

    this.logger.info(`Updated agent ${agentId}`)
  }

  async removeAgent(agentId: string) {
    this.logger.info(`Removing agent ${agentId}...`)

    this.removeHandlers.forEach(handler => {
      handler({ agent: this.currentAgents[agentId] })
    })

    await this.currentAgents[agentId]?.onDestroy()
    this.currentAgents[agentId] = null
  }

  async agentUpdated(agentId: string) {
    this.logger.info(`Creating agent ${agentId}`)
    const agentDBResult = (
      await app.service('agents').find({
        query: {
          id: agentId,
        },
      })
    )?.data

    if (agentDBResult.length == 0 || !agentDBResult) {
      this.logger.error(`Agent ${agentId} not found when updating agent`)
      throw new Error(`Agent ${agentId} not found when updating agent`)
    }

    const agent = agentDBResult[0]

    console.log(this.currentAgents)

    // start or stop the agent if the enabled state changed
    if (agent.enabled && !this.currentAgents[agentId]) {
      await this.addAgent(agentId)
    }
    if (!agent.enabled && this.currentAgents[agentId]) {
      await this.removeAgent(agentId)
    }

    // update the agent's rootSpellId if it changed
    // we may want to make this updating flow more robust in the future
    if (this.currentAgents[agentId] && agent.rootSpellId != this.currentAgents[agentId].rootSpellId) {
      this.currentAgents[agentId].rootSpellId = agent.rootSpellId
    }
  }

  async work() {
    this.logger.info('waiting for jobs')

    new Worker(
      'agent:run',
      async (job: Job<AgentRunJob>) => {
        if (job.data.agentId in this.currentAgents) {
          this.logger.info(`Running spell ${job.data.spellId} for agent ${job.data.agentId}`)
          try {
            const agent = this.currentAgents[job.data.agentId] as Agent
            const spellRunner = await agent.spellManager.loadById(job.data.spellId)

            if (!spellRunner) {
              throw new Error(`Spell ${job.data.spellId} not found on agent ${job.data.agentId}`)
            }

            await spellRunner.runComponent(job.data)
          } catch (e) {
            this.logger.error(`Error loading or running spell ${job.data.spellId} for agent ${job.data.agentId}`)
            throw e
          }
        } else {
          throw new Error(`Agent ${job.data.agentId} not found on this worker`)
        }
      }, { connection: app.get('redis') }
    )

    new Worker(
      'agent:updated',
      async (job: Job) => {
        switch (job.name) {
          case 'agent:updated':
            const data = job.data as AgentUpdateJob
            this.agentUpdated(data.agentId)
            break
          default:
            this.logger.error(
              `Received unknown job ${job.name} from queue ${job.queueName}`
            )
            throw new Error(
              `Received unknown job ${job.name} from queue ${job.queueName}`
            )
        }
      },
      {
        connection: app.get('redis'),
      }
    )
  }
}
