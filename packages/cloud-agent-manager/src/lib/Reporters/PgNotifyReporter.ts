import { Reporter } from "../Reporter"
import createSubscriber, { Subscriber } from "pg-listen"
import { getLogger } from "@magickml/core"

export class PgNotifyReporter implements Reporter {
    logger = getLogger()
    subscriber: Subscriber
    queueName: string

    constructor(queueName: string, dbUrl: string) {
        this.subscriber = createSubscriber({
            connectionString: dbUrl,
        })
        this.queueName = queueName
        this.initReporter()
    }

    async initReporter(): Promise<void> {
        this.logger.info("Initializing PgNotifyReporter...")
        this.subscriber.events.on("error", (error: any) => {
            console.error("Fatal database connection error:", error)
            process.exit(1)
        })

        await this.subscriber.connect()
        await this.subscriber.listenTo(this.queueName)
        this.logger.info("PgNotifyReporter initialized")
    }

    on(event: string, callback: (...args: any) => any): void {
        this.subscriber.notifications.on(this.queueName, (payload) => {
            if (payload?.eventName === event) {
                return callback(payload)
            }
        })
    }
}
