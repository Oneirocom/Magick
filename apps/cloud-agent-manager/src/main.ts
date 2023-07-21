import { CloudAgentManager } from "@magickml/cloud-agent-manager"
import { PgNotifyReporter } from "@magickml/cloud-agent-manager"
import { initLogger, getLogger } from "@magickml/core"
import { app, BullQueue, initApp } from "@magickml/server-core"
import { DATABASE_URL } from "@magickml/config"
import { initAgentCommander } from "@magickml/agents"


function start() {
    logger.info("Starting cloud agent manager...")
    const manager = new CloudAgentManager({
        newQueue: new BullQueue(),
        agentStateReporter: new PgNotifyReporter("agents", DATABASE_URL),
        pubSub: app.get('pubsub')
    });

    manager.run();
    logger.info("Cloud agent manager started")
}

initLogger({ name: "cloud-agent-manager" })
const logger = getLogger()
await initApp()
await initAgentCommander()
start()
