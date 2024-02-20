import { Worker, Job } from 'bullmq'
import { getLogger } from 'server/logger'
import { Application, app } from 'server/core'

import { BullMQWorker } from 'server/communication'

import { Agent } from 'server/agents'
import { AGENT_DELETE, AGENT_DELETE_JOB, AGENT_UPDATE_JOB } from 'communication'
import { type RedisPubSub } from 'server/redis-pubsub'
import pino from 'pino'
import { FeathersSyncReporter } from 'server/cloud-agent-manager'
import { AgentInterface } from 'server/schemas'

export interface AgentListRecord {
  id: string
  currentAgents: string[]
}

// I get that it's confusing extending AgentManager, but it's the best way to
// get the functionality I want without having to rewrite a bunch of stuff.
// Agent Managers just managed agents for a single instance of the server anyway
export class CloudAgentWorker {
  pubSub: RedisPubSub
  subscriptions: Record<string, Function> = {}
  logger: pino.Logger = getLogger()
  currentAgents: string[] = []
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

  async addAgent(agentId: string) {
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
      pingedAt: new Date().toISOString(),
    }

    if (!agentData.enabled) {
      this.logger.info(`Agent ${agentId} is disabled, skipping creation`)
      return
    }

    if (this.currentAgents[agentId]) {
      this.logger.error(`Agent ${agentId} already exists`)
      return
    }

    const agent = new Agent(
      agentData,
      this,
      new BullMQWorker(this.app.get('redis')),
      this.app.get('pubsub'),
      app
    )

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
    this.currentAgents[agentId] = null

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

    // start or stop the agent if the enabled state changed
    if (agent.enabled && !this.currentAgents[agentId]) {
      this.logger.info(`Agent ${agentId} enabled, adding agent`)
      await this.addAgent(agentId)
    }
    if (!agent.enabled && this.currentAgents[agentId]) {
      this.logger.info(`Agent ${agentId} disabled, removing agent`)
      await this.removeAgent(agentId)
    }

    // update the agent's rootSpellId if it changed
    // we may want to make this updating flow more robust in the future
    if (
      this.currentAgents[agentId] &&
      agent.rootSpellId != this.currentAgents[agentId].rootSpellId
    ) {
      this.currentAgents[agentId].rootSpellId = agent.rootSpellId
    }

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
        await this.agentUpdated(job.data.agentId)
      },
      {
        connection: app.get('redis'),
      }
    )
  }
}
