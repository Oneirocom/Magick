import pino from 'pino'
import { RedisPubSub } from '@magickml/redis-pubsub'
import { getLogger } from '@magickml/server-logger'
import { BullMQJob, MessageQueue } from 'server/communication'
import { app } from '@magickml/agent-server'
import { AgentInterface } from '@magickml/agent-server-schemas'
import { AGENT_DELETE_JOB } from '@magickml/agent-communication'
import { Reporter } from './Reporters'
import { AGENT_HEARTBEAT_INTERVAL_MSEC } from '@magickml/server-config'

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
    // On manager startup, bring all enabled agents online if not already.
    await this.bootstrapAgents()

    this.logger.info('Grace period before monitoring agents...')
    //initial grace period before we start monitoring agents
    const initialDelay = 15000 // 10-second grace period
    await new Promise(resolve => setTimeout(resolve, initialDelay))

    this.logger.info('Monitoring agents...')
    // Start monitoring heartbeats and managing agents.
    setInterval(() => this.manageAgents(), CHECK_INTERVAL)
  }

  async bootstrapAgents() {
    // Fetch all enabled agents from Redis.
    const enabledAgents = await this.fetchEnabledAgents()
    const onlineAgents = await this.fetchOnlineAgents()

    // Determine which enabled agents are not online and start them.
    const agentsToStart = enabledAgents.filter(
      agentId => !onlineAgents.includes(agentId)
    )

    agentsToStart.forEach(agentId => this.createAgent(agentId))
  }

  async manageAgents() {
    // Fetch all enabled agents from Redis.
    const enabledAgents = await this.fetchEnabledAgents()
    const onlineAgents = await this.fetchOnlineAgents()

    // Start any enabled agents that are not online.
    enabledAgents.forEach(agentId => {
      if (!onlineAgents.includes(agentId)) {
        this.createAgent(agentId)
      }
    })

    // Check for any agents that are online but not enabled, and stop them.
    onlineAgents.forEach(agentId => {
      if (!enabledAgents.includes(agentId)) {
        this.stopAgent(agentId)
      }
    })
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
      console.log('ERROR', err)
      throw new Error('Failed to fetch enabled agents')
    }
  }

  async fetchOnlineAgents() {
    // This function checks for agents with a recent heartbeat to determine if they are online.
    const agentIds = await this.fetchEnabledAgents() // Assuming enabled agents are candidates for being online.
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
        // check if a job is already waiting
        const waitingJobs = await this.newQueue.getWaitingJobs<BullMQJob[]>()

        if (waitingJobs.length > 0) {
          waitingJobs.forEach((job: BullMQJob) => {
            // don't add the job if it's already in the queue waiting to be picked up by a worker
            if (job.data.agentId === agentId) {
              return
            }
          })
        }

        this.newQueue.addJob('agent:create', { agentId })
      }
    } finally {
      await this.releaseLock(lockKey)
    }
  }

  stopAgent(agentId: string) {
    // Publish a message to MQ to stop the agent.
    this.pubSub.publish(
      AGENT_DELETE_JOB(agentId),
      JSON.stringify({ agentId: agentId })
    )
  }
}
