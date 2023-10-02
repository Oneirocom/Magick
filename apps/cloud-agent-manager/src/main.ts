import { CloudAgentManager, FeathersSyncReporter } from "@magickml/cloud-agent-manager"
import { initLogger, getLogger } from "@magickml/core"
import { app, BullQueue, initApp } from "@magickml/server-core"
import { DONT_CRASH_ON_ERROR, PRODUCTION } from "@magickml/config"
import { initAgentCommander } from "@magickml/agents"
import { getPinoTransport } from '@hyperdx/node-opentelemetry'

if (PRODUCTION) {
	initLogger({
		name: 'cloud-agent-worker',
		transport: {
			targets: [
				getPinoTransport('info')
			]
		},
		level: 'info',
	})
} else {
	initLogger({ name: 'cloud-agent-worker' })
}	
const logger = getLogger()

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
  process.on('uncaughtException', (e) => {
    logger.error('Uncaught exception: %s\n From: %o', e, e.stack)
  })

  process.on('unhandledRejection', (e) => {
    logger.error('Unhandled rejection: %s\n From: %o', e, e.stack)
  })
}

await initApp()
await initAgentCommander()
start()
