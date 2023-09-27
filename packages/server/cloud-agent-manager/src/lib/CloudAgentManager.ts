import pino from 'pino'
import { diff } from 'radash'
import {
  AGENT_DELETE,
  AGENT_DELETE_JOB,
  AGENT_UPDATE_JOB,
  getLogger,
} from 'shared/core'
import type { Reporter } from './Reporters'
import { type PubSub, type MessageQueue, app } from 'server/core'
import type { AgentListRecord } from 'server/cloud-agent-worker'
import { Agent } from 'packages/core/server/src/services/agents/agents.schema'

interface CloudAgentManagerConstructor {
  pubSub: PubSub
  newQueue: MessageQueue
  agentStateReporter: Reporter
}

type AgentList = Record<string, string[]>

export class CloudAgentManager {
  logger: pino.Logger = getLogger()
  newQueue: MessageQueue
  agentStateReporter: Reporter
  pubSub: PubSub
  workerToAgents: AgentList = {}

  constructor(args: CloudAgentManagerConstructor) {
    this.newQueue = args.newQueue
    this.newQueue.initialize('agent:new')
    this.agentStateReporter = args.agentStateReporter
    this.pubSub = app.get('pubsub')

    this.startup()
  }

  async startup() {
    this.logger.info('Cloud Agent Manager Startup')

    const enabledAgents = await app.service('agents').find({
      query: {
        enabled: true,
      },
    })

    this.logger.info(`Found ${enabledAgents.data.length} enabled agents`)
    const agentPromises: Promise<any>[] = []
    for (const agent of enabledAgents.data) {
      this.logger.debug(`Adding agent ${agent.id} to cloud agent worker`)
      agentPromises.push(
        this.newQueue.addJob(
          'agent:new',
          {
            agentId: agent.id,
          },
          `agent-new-${agent.id}-${new Date().getTime()}}`
        )
      )
    }

    await Promise.all(agentPromises)
  }

  async run() {
    this.agentStateReporter.on('agent:updated', async (data: unknown) => {
      const agent = data as Agent

      this.logger.info(`Agent Updated: ${agent.id}`)
      const agentUpdatedAt = agent.updatedAt
        ? new Date(agent.updatedAt)
        : new Date()

      if (agent.enabled) {
        this.logger.info(
          `Agent ${agent.id} enabled, adding to cloud agent worker`
        )
        await this.newQueue.addJob(
          'agent:new',
          {
            agentId: agent.id,
          },
          `agent-new-${agent.id}-${agentUpdatedAt.getTime()}`
        )
        this.logger.debug(`Agent create job for ${agent.id} added`)
        return
      }

      this.pubSub.publish(
        AGENT_UPDATE_JOB(agent.id),
        JSON.stringify({ agentId: agent.id })
      )
    })

    this.agentStateReporter.on(AGENT_DELETE, async (data: unknown) => {
      const agent = data as Agent
      this.pubSub.publish(
        AGENT_DELETE_JOB(agent.id),
        JSON.stringify({ agentId: agent.id })
      )
    })
  }

  // Eventually we'll need this heartbeat to keep track of running agents on workers
  async heartbeat() {
    this.pubSub.subscribe('cloud-agent-manager:pong', async list => {
      const listData = JSON.parse(list) as AgentListRecord

      const lastAgentsOnWorker = this.workerToAgents[listData.id] || []
      const agentsOnWorker = listData.currentAgents

      const agentsDiff = diff(lastAgentsOnWorker, agentsOnWorker)

      const agentsRestarted: string[] = []

      if (agentsDiff.length > 0) {
        this.logger.info(
          `Agents on worker ${listData.id} changed: ${agentsDiff}`
        )
        const agents = await app.service('agents').find({
          query: {
            id: {
              $in: agentsDiff,
            },
          },
        })

        for (const agent of agents.data) {
          if (agent.enabled) {
            this.pubSub.publish(
              'agent:updated',
              JSON.stringify({
                agentId: agent.id,
              })
            )
            agentsRestarted.push(agent.id)
          }
        }

        this.workerToAgents[listData.id] = agentsOnWorker
      } else {
        this.workerToAgents[listData.id] = [
          ...agentsOnWorker,
          ...agentsRestarted,
        ]
      }
    })

    setInterval(async () => {
      this.logger.trace('Heartbeat')
      this.pubSub.publish('cloud-agent-manager:ping', '')
    }, 1000 * 60 * 5)
  }
}
