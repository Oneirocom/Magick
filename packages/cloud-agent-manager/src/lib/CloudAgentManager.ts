import { Reporter } from "./Reporter";
import { MessageQueue } from "./MessageQueue";
import { logger } from "./Logger";

type MqMessage = any

interface CloudAgentManagerConstructor {
    mq: MessageQueue
    agentStateReporter?: Reporter
    retryReporter?: Reporter
}

export class CloudAgentManager {
    mq: MessageQueue
    agentStateReporter: Reporter
    retryReporter: Reporter

    constructor(args: CloudAgentManagerConstructor) {
        this.mq = args.mq
        this.agentStateReporter = args.agentStateReporter!
        this.retryReporter = args.retryReporter!
    }

    async run() {
    }
}
