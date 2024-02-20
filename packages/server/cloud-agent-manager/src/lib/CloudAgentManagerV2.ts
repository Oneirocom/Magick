import pino from 'pino'
import { RedisPubSub } from 'server/redis-pubsub'
import { getLogger } from 'server/logger'
import { MessageQueue } from 'server/communication'
import { app } from 'server/core'
import { AgentInterface } from 'server/schemas'
import { AGENT_DELETE_JOB } from 'communication'
import { Reporter } from './Reporters'
import { AGENT_HEARTBEAT_INTERVAL_MSEC } from 'shared/config'

const CHECK_INTERVAL = 10000 // Check every 15 seconds

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
    this.logger.info('Cloud Agent Manager Startup')
    this.newQueue = args.newQueue
    this.newQueue.initialize('agent:create')
    this.agentStateReporter = args.agentStateReporter
    this.pubSub = app.get('pubsub')
    this.start()
  }

  async start() {
    // On manager startup, bring all enabled agents online if not already.
    await this.bootstrapAgents()
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
    const enabledAgents = (await app.service('agents').find({
      paginate: false,
      query: {
        enabled: true,
        version: '2.0',
      },
    })) as AgentInterface[]

    return enabledAgents.map(agent => agent.id)
  }

  async fetchOnlineAgents() {
    // This function checks for agents with a recent heartbeat to determine if they are online.
    const agentIds = await this.fetchEnabledAgents() // Assuming enabled agents are candidates for being online.
    const now = Date.now()
    const onlineAgents = [] as string[]

    for (const agentId of agentIds) {
      const heartbeat: number | null = await new Promise(resolve => {
        app.get('redis').get(`agent:heartbeat:${agentId}`, (err, reply) => {
          if (err || !reply)
            resolve(null) // Treat errors as missing heartbeats for simplicity.
          else resolve(Number(reply))
        })
      })

      if (heartbeat && now - heartbeat < AGENT_HEARTBEAT_INTERVAL_MSEC) {
        onlineAgents.push(agentId)
      }
    }

    return onlineAgents
  }

  createAgent(agentId) {
    this.logger.info(`Creating agent ${agentId}...`)
    this.newQueue.addJob('agent:create', { agentId })
  }

  stopAgent(agentId) {
    // Publish a message to MQ to stop the agent.
    this.pubSub.publish(
      AGENT_DELETE_JOB(agentId),
      JSON.stringify({ agentId: agentId })
    )
  }
}
