import { CloudAgentManager, BullQueue } from "@magickml/cloud-agent-manager"
import { PgNotifyReporter } from "@magickml/cloud-agent-manager"
import { initLogger, getLogger } from "@magickml/core"
import { DATABASE_URL } from "@magickml/core"

function start() {
    logger.info("Starting cloud agent manager...")
    const manager = new CloudAgentManager({
        mq: new BullQueue("agent:updates"),
        agentStateReporter: new PgNotifyReporter("agents", DATABASE_URL),
    });

    manager.run();
    logger.info("Cloud agent manager started")
}

initLogger({ name: "cloud-agent-manager" })
const logger = getLogger()
start()
