import { Worker, Job } from 'bullmq'
import { bullMQConnection } from '@magickml/core'

import { app } from '@magickml/server-core'
import { Agent, AgentManager } from '@magickml/agents'

export class CloudAgentWorker extends AgentManager {
  constructor() {
    super(app, false)
  }

  async addAgent(agentId: string) {
    this.logger.info(`Creating agent ${agentId}...`)
    const agentDBResult = (
      await app.service('agents').find({
        query: {
          id: agentId
        }
      })
    )?.data

    if (agentDBResult.length == 0 || !agentDBResult) {
      this.logger.error(`Agent ${agentId} not found when creating agent`)
      throw new Error(`Agent ${agentId} not found when creating agent`)
    }

    const agentData = {
      ...agentDBResult[0],
      pingedAt: new Date().toISOString()
    }

    if (!agentData.enabled) {
      this.logger.info(`Agent ${agentId} is disabled, skipping creation`)
      return
    }

    const agent = new Agent(agentData, this, this.app)
    await agent.initialize({})

    this.logger.debug(`Running agent add handlers for ${agentId}`)
    this.addHandlers.forEach(handler => {
      handler({ agent, agentData })
    })

    this.currentAgents[agentId] = agent
    this.logger.debug(`Finished running agent add handlers for ${agentId}`)

    this.logger.info(`Created agent ${agentId}`)
  }

  async removeAgent(agentId: string) {
    this.logger.info(`Removing agent ${agentId}...`)

    this.removeHandlers.forEach(handler => {
      handler({ agent: this.currentAgents[agentId] })
    })

    await this.currentAgents[agentId]?.onDestroy()
  }

  async agentUpdated(agentId: string) {
    this.logger.info(`Creating agent ${agentId}`)
    const agentDBResult = (
      await app.service('agents').find({
        query: {
          id: agentId,
        }
      })
    )?.data

    if (agentDBResult.length == 0 || !agentDBResult) {
      this.logger.error(`Agent ${agentId} not found when creating agent`)
      throw new Error(`Agent ${agentId} not found when creating agent`)
    }

    const agent = agentDBResult[0]

    if (agent.enabled) {
      await this.addAgent(agentId)
    // TODO: care about runState for restarting agents
    //   switch (agent.runState) {
    //     case 'stopped':
    //     case 'failed':
    //       this.logger.info(`Starting agent ${agentId}`)
    //       await app.service('agents').patch(agentId, {
    //         runState: 'starting'
    //       })
    //     break;
    //   }
    } else {
      await this.removeAgent(agentId)
    }
  }

  async work() {
    this.logger.info('waiting for jobs')
    new Worker("agent:updates", async (job: Job) => {
      switch(job.name) {
          case 'agent:updated':
              this.agentUpdated(job.data.agentId)
              break
          default:
              this.logger.error(`Received unknown job ${job.name} from queue ${job.queueName}`)
              throw new Error(`Received unknown job ${job.name} from queue ${job.queueName}`)
      }

    },
    {
      connection: bullMQConnection
    })
  }
}
