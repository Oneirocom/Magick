import pino from "pino"
import { getLogger } from "@magickml/core"
import { Reporter } from "./Reporter"
import { MessageQueue } from "./MessageQueue"

interface CloudAgentManagerConstructor {
    mq: MessageQueue
    agentStateReporter: Reporter
}

export class CloudAgentManager {
    logger: pino.Logger = getLogger()
    mq: MessageQueue
    agentStateReporter: Reporter

    constructor(args: CloudAgentManagerConstructor) {
        this.mq = args.mq
        this.agentStateReporter = args.agentStateReporter!
    }

    async run() {
        this.agentStateReporter.on('agent:updated', async (agent: any) => {
            Date.now()
            this.logger.info(`Agent Updated: ${agent.id}`)
            const agentUpdatedAt = new Date(agent.updatedAt)
            await this.mq.addJob('agent:updated', {agentId: agent.id}, `agent-updated-${agent.id}-${agentUpdatedAt.getTime()}`)
        })
    }
}
