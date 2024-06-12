import pino from 'pino'
import { RedisPubSub } from 'server/redis-pubsub'
import { getLogger } from 'server/logger'
import { MessageQueue } from 'server/communication'
import { app } from 'server/core'
import { AgentInterface } from 'server/schemas'
import { AGENT_DELETE_JOB } from 'communication'
import { Reporter } from './Reporters'
import { AGENT_HEARTBEAT_INTERVAL_MSEC } from 'shared/config'

const CHECK_INTERVAL = 10000 // Check every 10 seconds

interface CloudAgentManagerConstructor {
  pubSub: RedisPubSub
  newQueue: MessageQueue
  agentStateReporter: Reporter
}

export class CloudAgentManagerV2 {
  logger: pino.Logger = getLogger()
  newQueue: MessageQueue
  agentStateReporter: Reporter
  pubSub: RedisPubSub

  constructor(args: CloudAgentManagerConstructor) {
    this.newQueue = args.newQueue
    this.newQueue.initialize('agent:create')
    this.agentStateReporter = args.agentStateReporter
    this.pubSub = app.get('pubsub')
  }

  async start() {
    this.logger.info('Bootstrapping agents...')
    await this.bootstrapAgents()

    this.logger.info('Grace period before monitoring agents...')
    const initialDelay = 15000 // 10-second grace period
    await new Promise(resolve => setTimeout(resolve, initialDelay))

    this.logger.info('Monitoring agents...')
    setInterval(() => this.manageAgents(), CHECK_INTERVAL)
  }

  async bootstrapAgents() {
    const enabledAgents = await this.fetchEnabledAgents()
    const onlineAgents = await this.fetchOnlineAgents()

    const agentsToStart = enabledAgents.filter(
      agentId => !onlineAgents.includes(agentId)
    )

    for (const agentId of agentsToStart) {
      await this.createAgent(agentId)
    }
  }

  async manageAgents() {
    const enabledAgents = await this.fetchEnabledAgents()
    const onlineAgents = await this.fetchOnlineAgents()

    for (const agentId of enabledAgents) {
      if (!onlineAgents.includes(agentId)) {
        await this.createAgent(agentId)
      }
    }

    for (const agentId of onlineAgents) {
      if (!enabledAgents.includes(agentId)) {
        await this.stopAgent(agentId)
      }
    }
  }

  async fetchEnabledAgents() {
    try {
      const enabledAgents = (await app.service('agents').find({
        paginate: false,
        query: {
          enabled: true,
          version: '2.0',
        },
      })) as AgentInterface[]
      return enabledAgents.map(agent => agent.id)
    } catch (err) {
      this.logger.error('Failed to fetch enabled agents', err)
      throw new Error('Failed to fetch enabled agents')
    }
  }

  async fetchOnlineAgents() {
    const agentIds = await this.fetchEnabledAgents()
    const now = Date.now()
    const onlineAgents = [] as string[]

    for (const agentId of agentIds) {
      const heartbeat: string | null = await app
        .get('redis')
        .get(`agent:heartbeat:${agentId}`)

      if (
        heartbeat &&
        now - Number(heartbeat) < AGENT_HEARTBEAT_INTERVAL_MSEC
      ) {
        onlineAgents.push(agentId)
      }
    }

    return onlineAgents
  }

  async acquireLock(lockKey: string, timeout: number = 5000): Promise<boolean> {
    const startTime = Date.now()
    while (Date.now() - startTime < timeout) {
      const result = await this.pubSub.setnx(lockKey, '1')
      if (result === 1) {
        await this.pubSub.expire(lockKey, 10)
        return true
      }
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    return false
  }

  async releaseLock(lockKey: string): Promise<void> {
    await this.pubSub.del(lockKey)
  }

  async createAgent(agentId: string) {
    const lockKey = `agent:lock:${agentId}`
    const lock = await this.acquireLock(lockKey)

    if (!lock) {
      this.logger.info(
        `Agent ${agentId} is already being created by another worker`
      )
      return
    }

    try {
      const onlineAgents = await this.fetchOnlineAgents()
      if (!onlineAgents.includes(agentId)) {
        this.logger.info(`Creating agent ${agentId}...`)
        await this.newQueue.addJob('agent:create', { agentId })
      }
    } finally {
      await this.releaseLock(lockKey)
    }
  }

  async stopAgent(agentId: string) {
    await this.pubSub.publish(
      AGENT_DELETE_JOB(agentId),
      JSON.stringify({ agentId })
    )
  }
}
