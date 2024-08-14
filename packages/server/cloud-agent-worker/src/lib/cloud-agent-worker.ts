import { Worker, Job } from 'bullmq'
import { getLogger } from '@magickml/server-logger'
import { Application, app } from '@magickml/agent-server'

import { Agent } from '@magickml/agents'
import {
  AGENT_DELETE,
  AGENT_DELETE_JOB,
  AGENT_UPDATE_JOB,
} from '@magickml/agent-communication'
import { type RedisPubSub } from '@magickml/redis-pubsub'
import pino from 'pino'
import { FeathersSyncReporter } from 'server/cloud-agent-manager'
import { AgentInterface } from '@magickml/agent-server-schemas'

export interface AgentListRecord {
  id: string
  currentAgents: string[]
}

const HEARTBEAT_THRESHOLD = 60000

// I get that it's confusing extending AgentManager, but it's the best way to
// get the functionality I want without having to rewrite a bunch of stuff.
// Agent Managers just managed agents for a single instance of the server anyway
export class CloudAgentWorker {
  pubSub: RedisPubSub
  subscriptions: Record<string, Function> = {}
  logger: pino.Logger = getLogger()
  currentAgents: Record<string, Agent> = {}
  agentStateReporter: FeathersSyncReporter
  app: Application

  constructor(app: Application) {
    this.app = app
    this.pubSub = app.get('pubsub')

    this.agentStateReporter = new FeathersSyncReporter()

    this.pubSub.subscribe(AGENT_DELETE, async (agentId: string) => {
      this.logger.info(
        `Agent ${agentId} deleted, removing from cloud agent worker`
      )
      await this.removeAgent(agentId)
    })

    this.addAgent = this.addAgent.bind(this)
  }

  getAgent(agentId: string) {
    return this.currentAgents[agentId]
  }

  async setAgentStatus(agentId: string, status: 'active' | 'inactive') {
    const redis = this.app.get('redis')
    const agentStatusKey = `agent:status:${agentId}`

    const expiry = 120 // Example: Expiry of 2x heartbeat interval
    await redis.set(agentStatusKey, status, 'EX', expiry)
  }

  async checkAgentRunning(agentId: string): Promise<boolean> {
    const redis = this.app.get('redis')
    const heartbeatKey = `agent:heartbeat:${agentId}`

    const heartbeat = await redis.get(heartbeatKey)

    if (heartbeat) {
      const lastHeartbeat = parseInt(heartbeat, 10)
      const currentTime = Date.now()
      const heartbeatThreshold = HEARTBEAT_THRESHOLD // Consider agent as running if heartbeat is within 60 seconds

      if (currentTime - lastHeartbeat <= heartbeatThreshold) {
        return true
      }
    }

    return false
  }

  async addAgent(agentId: string) {
    const isAgentRunning = await this.checkAgentRunning(agentId)
    if (isAgentRunning) {
      this.logger.trace(
        `Agent ${agentId} is already running on another worker, skipping creation`
      )
      return
    }

    this.logger.info(`Creating agent ${agentId}...`)
    const agentDBRes = await app.service('agents').find({
      query: {
        id: agentId,
      },
    })

    const agentDBResult = Array.isArray(agentDBRes)
      ? agentDBRes
      : agentDBRes?.data

    if (agentDBResult.length == 0 || !agentDBResult) {
      this.logger.error(`Agent ${agentId} not found when creating agent`)
      throw new Error(`Agent ${agentId} not found when creating agent`)
    }

    const agentData = {
      ...agentDBResult[0],
      // TODO: Deprecated
      // pingedAt: new Date().toISOString(),
    }

    if (!agentData.enabled) {
      this.logger.info(`Agent ${agentId} is disabled, skipping creation`)
      return
    }

    if (this.currentAgents[agentId]) {
      this.logger.error(`Agent ${agentId} already exists`)
      return
    }

    const agent = new Agent(agentData, this.app.get('pubsub'), app)

    this.setAgentStatus(agentId, 'active')

    this.listenForChanges(agentId)

    this.currentAgents[agentId] = agent

    this.logger.info(`Updated agent ${agentId}`)
  }

  async removeAgent(agentId: string) {
    this.logger.info(`Removing agent ${agentId}...`)

    if (!this.currentAgents[agentId]) {
      this.logger.error(`Error removing agent. Agent ${agentId} does not exist`)
      return
    }

    await this.currentAgents[agentId]?.onDestroy()
    delete this.currentAgents[agentId]

    this.setAgentStatus(agentId, 'inactive')

    this.pubSub.unsubscribe(AGENT_UPDATE_JOB(agentId))
  }

  async agentUpdated(agentId: string) {
    const agentDBRes = await app.service('agents').find({
      query: {
        id: agentId,
      },
    })

    const agentDBResult = Array.isArray(agentDBRes)
      ? agentDBRes
      : agentDBRes?.data

    if (agentDBResult.length == 0 || !agentDBResult) {
      this.logger.error(`Agent ${agentId} not found when updating agent`)
      throw new Error(`Agent ${agentId} not found when updating agent`)
    }

    const agent = agentDBResult[0]

    if (this.currentAgents[agentId]) {
      this.currentAgents[agentId].update(agent)
    }
  }

  async listenForChanges(agentId: string) {
    this.agentStateReporter.on(
      `agent:updated:${agentId}`,
      async (agent: AgentInterface) => {
        if (agent.id === agentId) {
          this.logger.info(`Agent ${agentId} updated, updating agent`)
          await this.agentUpdated(agentId)
        }
      }
    )

    this.pubSub.subscribe(AGENT_UPDATE_JOB(agentId), async () => {
      this.logger.info(`Agent ${agentId} updated, updating agent`)
      await this.agentUpdated(agentId)
    })

    this.pubSub.subscribe(AGENT_DELETE_JOB(agentId), async () => {
      this.logger.info(`Agent ${agentId} updated, updating agent`)
      this.removeAgent(agentId)
    })
  }

  async startWork() {
    this.logger.info('waiting for jobs')

    const redis = app.get('redis')

    await redis.sadd('agent-workers', 'me')

    new Worker(
      'agent:create',
      async (job: Job) => {
        await this.addAgent(job.data.agentId)
      },
      {
        connection: app.get('redis'),
      }
    )
  }
}
