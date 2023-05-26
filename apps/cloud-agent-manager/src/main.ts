import { CloudAgentManager, BullQueue } from "@magickml/cloud-agent-manager"
import { FeathersSyncReporter } from "@magickml/cloud-agent-manager"
import { initLogger, getLogger } from "@magickml/core"

function start() {
    logger.info("Starting cloud agent manager...")
    const manager = new CloudAgentManager({
        mq: new BullQueue("agents-changes"),
        agentStateReporter: new FeathersSyncReporter(),
    });

    manager.run();
    logger.info("Cloud agent manager started")
}

initLogger({ name: "cloud-agent-manager" })
const logger = getLogger()
start()
