import { Worker, Job } from 'bullmq'
import { hostname } from 'os'
import pino from 'pino'
import { getLogger } from '@magickml/core'

import { app } from '@magickml/server-core'

const runningAgents = []

export class CloudAgentWorker {
  logger: pino.Logger = getLogger()

  constructor() {}

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
      switch (agent.runState) {
        case 'stopped':
        case 'failed':
          await app.service('agents').patch(agentId, {
            runState: 'starting'
          })
        break;
      }
    }
  }

  async work() {
    this.logger.info('waiting for jobs')
    const worker = new Worker("agent:changed", async (job: Job) => {
      switch(job.name) {
          case 'agent:updated':
              this.agentUpdated(job.data.agentId)
              break
          default:
              this.logger.error(`Received unknown job ${job.name} from queue ${job.queueName}`)
              throw new Error(`Received unknown job ${job.name} from queue ${job.queueName}`)
              break
      }

    },
    {
      connection: {
        host: 'localhost',
        port: 6379
      }
    })
  }
}
