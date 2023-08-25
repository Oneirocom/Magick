import { CloudAgentManager, FeathersSyncReporter } from "@magickml/cloud-agent-manager"
import { initLogger, getLogger } from "@magickml/core"
import { app, BullQueue, initApp } from "@magickml/server-core"
import { DONT_CRASH_ON_ERROR, PRODUCTION } from "@magickml/config"
import { initAgentCommander } from "@magickml/agents"

function start() {
    logger.info("Starting cloud agent manager...")
    const manager = new CloudAgentManager({
        newQueue: new BullQueue(),
        agentStateReporter: new FeathersSyncReporter(),
        pubSub: app.get('pubsub')
    });

    manager.run();
    logger.info("Cloud agent manager started")
}

if (PRODUCTION || DONT_CRASH_ON_ERROR) {
  process.on('uncaughtException', (e, o) => {
    logger.error('Uncaught exception: %s\n From: %o', e, o)
  })

  process.on('unhandledRejection', (e, o) => {
    logger.error('Unhandled rejection: %s\n From: %o', e, o)
  })
}

initLogger({ name: "cloud-agent-manager" })
const logger = getLogger()
await initApp()
await initAgentCommander()
start()
