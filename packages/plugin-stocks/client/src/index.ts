import {
  ClientPlugin,
  eventSocket,
} from '@magickml/engine'
import { DiscordAgentWindow } from './components/agent.component'

const DiscordPlugin = new ClientPlugin({
  name: 'DiscordPlugin',
  agentComponents: [DiscordAgentWindow],
  inputTypes: [
    { name: 'Discord (Voice)', trigger: true, socket: eventSocket},
    { name: 'Discord (Text)', trigger: true, socket: eventSocket },
  ],
  outputTypes: [
    { name: 'Discord (Voice)', trigger: false, socket: eventSocket },
    { name: 'Discord (Text)', trigger: false, socket: eventSocket },
  ],
  secrets: [{
    name: 'Discord API Key',
    key: 'discord_api_key',
    global: false
  }]
})

export default DiscordPlugin
