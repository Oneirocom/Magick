import pino from "pino"
import { getLogger } from "@magickml/core"
import type { Reporter } from "./Reporters"
import type { PubSub, MessageQueue } from "@magickml/server-core"

interface CloudAgentManagerConstructor {
    pubSub: PubSub
    mq: MessageQueue
    agentStateReporter: Reporter
}

export class CloudAgentManager {
    logger: pino.Logger = getLogger()
    mq: MessageQueue
    agentStateReporter: Reporter
    pubSub: PubSub

    constructor(args: CloudAgentManagerConstructor) {
        this.mq = args.mq
        this.mq.initialize('agent:updated')
        this.agentStateReporter = args.agentStateReporter
        this.pubSub = args.pubSub
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
}
