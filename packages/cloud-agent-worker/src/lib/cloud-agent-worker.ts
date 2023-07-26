import { Worker, Job } from 'bullmq'

import { BullMQWorker, type PubSub, RedisPubSubWrapper, app, BullQueue, MessageQueue } from '@magickml/server-core'
import { Agent, AgentManager, type AgentRunJob } from '@magickml/agents'
import { v4 as uuidv4 } from 'uuid'
import { AGENT_DELETE, AGENT_DELETE_JOB, AGENT_RUN_JOB, AGENT_UPDATE_JOB } from '@magickml/core'

export interface AgentListRecord {
  id: string
  currentAgents: string[]
}

// I get that it's confusing extending AgentManager, but it's the best way to
// get the functionality I want without having to rewrite a bunch of stuff.
// Agent Managers just managed agents for a single instance of the server anyway
export class CloudAgentWorker extends AgentManager {
  pubSub: PubSub
  subscriptions: Record<string, Function> = {}

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
    this.pubSub.subscribe('cloud-agents:ping', async () => {
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

    const agentQueue = new BullQueue()
    agentQueue.initialize(AGENT_RUN_JOB(agent.id))
    this.listenForRun(agentQueue, agent.id)
    this.listenForChanges(agentId)


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

    this.pubSub.unsubscribe(AGENT_UPDATE_JOB(agentId))
    this.pubSub.unsubscribe(AGENT_RUN_JOB(agentId))
  }

  async agentUpdated(agentId: string) {
    this.logger.info(`Updating agent ${agentId}`)
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

  async listenForRun(agentQueue: MessageQueue, agentId: string) {
    this.logger.debug(`Listening for run for agent ${agentId}`)
    this.logger.debug(AGENT_RUN_JOB(agentId))
    this.pubSub.subscribe(AGENT_RUN_JOB(agentId),
      async (data: AgentRunJob) => {
          this.logger.info(`Running spell ${data.spellId} for agent ${data.agentId}`)
          try {
            await agentQueue.addJob(AGENT_RUN_JOB(agentId), {
              ...data,
              agentId: data.agentId,
            }, data.jobId)
        } catch (e) {
            this.logger.error(`Error loading or running spell ${data.spellId} for agent ${data.agentId}`)
            throw e
          }
      })
  }

  async listenForChanges(agentId: string) {
    this.pubSub.subscribe(AGENT_UPDATE_JOB(agentId), async () => {
      this.logger.info(`Agent ${agentId} updated, updating agent`)
      this.agentUpdated(agentId)
    })
    this.pubSub.subscribe(AGENT_DELETE_JOB(agentId), async () => {
      this.logger.info(`Agent ${agentId} updated, updating agent`)
      this.removeAgent(agentId)
    })
  }

  async work() {
    this.logger.info('waiting for jobs')

    new Worker(
      'agent:new',
      async (job: Job) => {
        this.agentUpdated(job.data.agentId)
      },
      {
        connection: app.get('redis'),
      }
    )
  }
}
