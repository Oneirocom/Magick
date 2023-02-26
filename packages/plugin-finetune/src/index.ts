import {default as FineTuneManager} from './screens/Home'

import { Plugin } from "@magickml/engine"

const FineTuneManager = new Plugin({
  name: 'FineTuneManagerPlugin',
  windowComponents: [{
    element: FineTuneManager,
    path: '/fineTuneManager',
  }],
  agentMethods: getAgentMethods(),
})

export default DiscordPlugin;