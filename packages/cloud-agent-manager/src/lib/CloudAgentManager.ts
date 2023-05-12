import { Reporter } from "./Reporter";
import { MessageQueue } from "./MessageQueue";
import { logger } from "./Logger";

interface CloudAgentManagerConstructor {
    mq: MessageQueue
    agentStateReporter: Reporter
}

export class CloudAgentManager {
    mq: MessageQueue
    agentStateReporter: Reporter

    constructor(args: CloudAgentManagerConstructor) {
        this.mq = args.mq
        this.agentStateReporter = args.agentStateReporter!
    }

    async run() {
        this.agentStateReporter.on('new-agent', async (agent: any) => {
            logger.info(`New agent created: ${agent.id}`)
            await this.mq.addJob('create-agent', {agentId: agent.id})
        })
    }
}
