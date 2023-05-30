import { Reporter } from "../Reporter"
import createSubscriber from "pg-listen"

export class PgNotifyReporter implements Reporter {
    emitter: any

    constructor(dbUrl: string) {
        this.initReporter(dbUrl)
    }

    async initReporter(dbUrl: string): Promise<void> {
        const subscriber = createSubscriber({
            connectionString: dbUrl,
        })

        subscriber.events.on("error", (error: any) => {
            console.error("Fatal database connection error:", error)
            process.exit(1)
        })

        await subscriber.connect()
        await subscriber.listenTo("agents")
        this.emitter = subscriber
    }

    on(event: string, callback: (...args: any) => any): void {
        this.emitter.events.on(event, callback)
    }
}
