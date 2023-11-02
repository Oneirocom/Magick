import pino from "pino"
import { diff, unique } from "radash"
import { AGENT_DELETE, AGENT_DELETE_JOB, AGENT_UPDATE_JOB, getLogger } from "@magickml/core"
import type { Reporter } from "./Reporters"
import { type PubSub, type MessageQueue, app } from "@magickml/server-core"
import { Agent } from "packages/core/server/src/services/agents/agents.schema"
import { HEARTBEAT_MSEC, MANAGER_WARM_UP_MSEC } from "@magickml/config"

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
      const agent = data as Agent

      this.logger.info(`Agent Updated: ${agent.id}`)

      if (agent.enabled) {
        this.logger.info(`Agent ${agent.id} enabled, adding to cloud agent worker`)
        await this.newQueue.addJob('agent:new', {agentId: agent.id})
        this.logger.debug(`Agent create job for ${agent.id} added`)
        return
      }

      this.pubSub.publish(AGENT_UPDATE_JOB(agent.id), JSON.stringify({ agentId: agent.id }))
    })

    this.agentStateReporter.on(AGENT_DELETE, async (data: unknown) => {
      const agent = data as Agent
      this.pubSub.publish(AGENT_DELETE_JOB(agent.id), JSON.stringify({ agentId: agent.id }))
    })
  }

  async dedupeAgents(agents: string[]) {
    const deduped = unique(agents)
    const diffAgents = diff(agents, deduped)

    this.logger.info("deduping agents %o", diffAgents)
    diffAgents.forEach(async (agentId) => {
      await this.pubSub.publish(AGENT_DELETE_JOB(agentId), JSON.stringify({ agentId: agentId }))
      await this.newQueue.addJob('agent:new', {agentId: agentId})
    })

    return deduped
  }

  // Eventually we'll need this heartbeat to keep track of running agents on workers
  async heartbeat() {
    this.logger.debug("Started heartbeat")
    let agentsOfWorkers: string[] = []
    this.pubSub.subscribe("heartbeat-pong", async (agents: string[]) => {
      this.logger.debug("Got heartbeat pong")
      agents.forEach(a => agentsOfWorkers.push(a))
      agentsOfWorkers = await this.dedupeAgents(agentsOfWorkers)
    })
    await this.pubSub.publish("heartbeat-ping", "{}")

    setTimeout(() => 
      setInterval(async () => {
        this.logger.debug(`Starting Heartbeat update`)
        const enabledAgents = await app.service('agents').find({
          query: {
            enabled: true,
          },
        })

        const agentDiff = diff(enabledAgents.data.map(a => a.id), Array.from(agentsOfWorkers))
        const agentsToUpdate = enabledAgents.data.filter(a => agentDiff.includes(a.id))

        if (agentDiff.length > 0) {
          this.logger.info(`Found ${agentDiff.length} agents to Update`)
          const agentPromises: Promise<any>[] = []
          for (const agent of agentsToUpdate) {
            this.logger.debug(`Adding agent ${agent.id} to cloud agent worker`)
            agentPromises.push(this.newQueue.addJob('agent:new', {agentId: agent.id}))
          }

          await Promise.all(agentPromises)
        }
        agentsOfWorkers = [];
        this.pubSub.publish("heartbeat-ping", "{}")
      }, HEARTBEAT_MSEC), MANAGER_WARM_UP_MSEC)
  }
}
