import {
  ClientPlugin,
  eventSocket,
} from '@magickml/engine'
import { TwitterAgentWindow } from './components/agent.component'

const TwitterPlugin = new ClientPlugin({
  name: 'TwitterPlugin',
  agentComponents: [TwitterAgentWindow],
  inputTypes: [
    { name: 'Twitter', trigger: true, socket: eventSocket },
  ],
  outputTypes: [
    { name: 'Twitter', trigger: true, socket: eventSocket },
  ],
  secrets: []
})

export default TwitterPlugin
