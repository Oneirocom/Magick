import { CloudAgentManager, BullQueue } from "@magickml/cloud-agent-manager"
import { FeathersSyncReporter } from "@magickml/cloud-agent-manager"

function start() {
    const manager = new CloudAgentManager({
        mq: new BullQueue("test"),
        agentStateReporter: new FeathersSyncReporter(),
    });

    manager.run();
}

start()
