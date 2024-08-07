import pino from 'pino'
import { diff, unique } from 'radash'
import type { Reporter } from './Reporters'
import { getLogger } from '@magickml/server-logger'
import { RedisPubSub } from '@magickml/redis-pubsub'
import { MessageQueue } from 'server/communication'
import { app } from '@magickml/agent-server'
import { AgentInterface } from '@magickml/agent-server-schemas'
import {
  AGENT_DELETE,
  AGENT_DELETE_JOB,
  AGENT_UPDATE_JOB,
} from '@magickml/agent-communication'
import { HEARTBEAT_MSEC, MANAGER_WARM_UP_MSEC } from '@magickml/server-config'
// import { HEARTBEAT_MSEC, MANAGER_WARM_UP_MSEC } from '@magickml/config'

interface CloudAgentManagerConstructor {
  pubSub: RedisPubSub
  newQueue: MessageQueue
  agentStateReporter: Reporter
}

type AgentList = Record<string, string[]>

export class CloudAgentManager {
  logger: pino.Logger = getLogger()
  newQueue: MessageQueue
  agentStateReporter: Reporter
  pubSub: RedisPubSub
  workerToAgents: AgentList = {}

  constructor(args: CloudAgentManagerConstructor) {
    this.logger.info('Cloud Agent Manager Startup')
    this.newQueue = args.newQueue
    this.newQueue.initialize('agent:new')
    this.agentStateReporter = args.agentStateReporter
    this.pubSub = app.get('pubsub')

    this.run = this.run.bind(this)
    this.heartbeat = this.heartbeat.bind(this)
    this.dedupeAgents = this.dedupeAgents.bind(this)

    this.heartbeat()
  }

  async run() {
    this.agentStateReporter.on('agent:updated', async (data: unknown) => {
      const agent = data as AgentInterface

      this.logger.info(`Agent Updated: ${agent.id}`)

      if (agent.enabled) {
        this.logger.info(
          `Agent ${agent.id} enabled, adding to cloud agent worker`
        )
        await this.newQueue.addJob('agent:new', { agentId: agent.id })
        this.logger.debug(`Agent create job for ${agent.id} added`)
        return
      }

      this.pubSub.publish(
        AGENT_UPDATE_JOB(agent.id),
        JSON.stringify({ agentId: agent.id })
      )
    })

    this.agentStateReporter.on(AGENT_DELETE, async (data: unknown) => {
      const agent = data as AgentInterface
      this.pubSub.publish(
        AGENT_DELETE_JOB(agent.id),
        JSON.stringify({ agentId: agent.id })
      )
    })
  }

  async dedupeAgents(agents: string[]) {
    const deduped = unique(agents)
    const diffAgents = diff(agents, deduped)

    if (diffAgents.length === 0) return deduped

    this.logger.info(`Found ${diffAgents.length} agents to Update`)

    diffAgents.forEach(async agentId => {
      await this.pubSub.publish(
        AGENT_DELETE_JOB(agentId),
        JSON.stringify({ agentId: agentId })
      )
      await this.newQueue.addJob('agent:new', { agentId: agentId })
    })

    return deduped
  }

  // Eventually we'll need this heartbeat to keep track of running agents on workers
  async heartbeat() {
    this.logger.debug('Started heartbeat')
    const agentsOfWorkers = new Set<string>()

    this.pubSub.subscribe('heartbeat-pong', (agents: string[]) => {
      agents.forEach(agent => agentsOfWorkers.add(agent))
    })

    await this.pubSub.publish('heartbeat-ping', '{}')

    this.logger.trace('Starting Heartbeat update')
    setTimeout(() => {
      setInterval(async () => {
        const enabledAgents = (await app.service('agents').find({
          paginate: false,
          query: {
            enabled: true,
            version: '2.0',
          },
        })) as AgentInterface[]

        const enabledAgentIds = new Set(enabledAgents.map(agent => agent.id))
        const agentsToUpdate = [...enabledAgentIds].filter(
          agentId => !agentsOfWorkers.has(agentId)
        )

        if (agentsToUpdate.length > 0) {
          this.logger.info(`Found ${agentsToUpdate.length} agents to update`)
          // Instead of deduping again, directly handle the discrepancy
          const updatePromises = agentsToUpdate.map(agentId =>
            this.newQueue.addJob('agent:new', { agentId })
          )
          await Promise.all(updatePromises)
        }

        agentsOfWorkers.clear()
        this.pubSub.publish('heartbeat-ping', '{}')
      }, HEARTBEAT_MSEC)
    }, MANAGER_WARM_UP_MSEC)
  }
}
