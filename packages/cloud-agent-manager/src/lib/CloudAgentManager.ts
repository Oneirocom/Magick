import pino from "pino"
import { diff } from "radash"
import { getLogger } from "@magickml/core"
import type { Reporter } from "./Reporters"
import { type PubSub, type MessageQueue, app } from "@magickml/server-core"
import type { AgentListRecord } from '@magickml/cloud-agent-worker'

interface CloudAgentManagerConstructor {
    pubSub: PubSub
    mq: MessageQueue
    agentStateReporter: Reporter
}

type AgentList = Record<string, string[]>

export class CloudAgentManager {
    logger: pino.Logger = getLogger()
    mq: MessageQueue
    agentStateReporter: Reporter
    pubSub: PubSub
    workerToAgents: AgentList = {}

    constructor(args: CloudAgentManagerConstructor) {
        this.mq = args.mq
        this.mq.initialize('agent:updated')
        this.agentStateReporter = args.agentStateReporter
        this.pubSub = app.get('pubsub')


        this.startup().then(() => this.heartbeat())
    }

    async startup() {
        this.logger.info('Cloud Agent Manager Startup')

        const enabledAgents = await app.service('agents').find({
            query: {
                enabled: true,
            },
        })

        for (const agent of enabledAgents.data) {
            this.mq.addJob('agent:updated', {
                agentId: agent.id,
            }, `agent-updated-${agent.id}-${new Date().getTime()}`)
        }
    }

    async run() {
        this.agentStateReporter.on('agent:updated', async (agent: any) => {
            this.logger.info(`Agent Updated: ${agent.id}`)
            const agentUpdatedAt = new Date(agent.updatedAt)
            await this.mq.addJob('agent:updated', {
                agentId: agent.id,
            }, `agent-updated-${agent.id}-${agentUpdatedAt.getTime()}`)
        })
    }

    async heartbeat() {
        this.pubSub.subscribe('cloud-agent-manager:pong', async (list) => {
            const listData = JSON.parse(list) as AgentListRecord

            const lastAgentsOnWorker = this.workerToAgents[listData.id] || []
            const agentsOnWorker = listData.currentAgents

            const agentsDiff = diff(lastAgentsOnWorker, agentsOnWorker)

            const agentsRestarted: string[] = []

            if (agentsDiff.length > 0) {
                this.logger.info(`Agents on worker ${listData.id} changed: ${agentsDiff}`)
                const agents = await app.service('agents').find({
                    query: {
                        id: {
                            $in: agentsDiff,
                        },
                    },
                })

                for (const agent of agents.data) {
                    if (agent.enabled) {
                        this.mq.addJob('agent:updated', {
                            agentId: agent.id,
                        }, `agent-updated-${agent.id}-${new Date().getTime()}`)
                        agentsRestarted.push(agent.id)
                    }
                }

                this.workerToAgents[listData.id] = agentsOnWorker
            } else {
                this.workerToAgents[listData.id] = [...agentsOnWorker, ...agentsRestarted]
            }
        })

        setInterval(async () => {
            this.logger.info('Heartbeat')
            this.pubSub.publish('cloud-agent-manager:ping', "")
        }, 1000 * 60 * 5)
    }
}
