import {
  ClientPlugin,
  eventSocket,
} from '@magickml/engine'
import { TwitterAgentWindow } from './components/agent.component'

const TwitterPlugin = new ClientPlugin({
  name: 'TwitterPlugin',
  agentComponents: [TwitterAgentWindow],
  inputTypes: [
    { name: 'Twitter (Feed)', trigger: true, socket: eventSocket},
    { name: 'Twitter (DM)', trigger: true, socket: eventSocket },
  ],
  outputTypes: [
    { name: 'Twitter (Feed)', trigger: false, socket: eventSocket },
    { name: 'Twitter (DM)', trigger: false, socket: eventSocket },
  ],
  secrets: [{
    name: 'Twitter API Key',
    key: 'twitter_api_key',
    global: false
  }]
})

export default TwitterPlugin
