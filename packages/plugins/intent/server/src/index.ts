import {
  eventSocket,
  ServerPlugin,
  triggerSocket,
  getLogger,
} from '@magickml/core'

import { getNodes } from '@magickml/plugin-intent-shared'

type StartIntentArgs = {
  agent: any
  spellRunner: any
}

function getAgentMethods() {
  async function startIntent({ agent, spellRunner }: StartIntentArgs) {
    const logger = getLogger()
    logger.info('starting intent connect')
  }

  async function stopIntent({ agent }) {
    const logger = getLogger()
    logger.info('Stopped intent client for agent ' + agent.name)
  }

  return {
    start: startIntent,
    stop: stopIntent,
  }
}

const IntentPlugin = new ServerPlugin({
  name: 'IntentPlugin',
  nodes: getNodes(),
  agentMethods: getAgentMethods(),
})

export default IntentPlugin
