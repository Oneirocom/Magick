import {
  ClientPlugin,
  eventSocket,
  SpellInterface,
  triggerSocket,
} from '@magickml/engine'
import { DiscordAgentWindow } from './components/agent.component'

import _DiscordSpellTemplate from './templates/spells/Discord Bot.spell.json'

// TODO: add schema validation with e.g. zod
const DiscordSpellTemplate = _DiscordSpellTemplate as unknown as SpellInterface

// TODO: Change these to be full inputs
const inputSockets = [
  {
    socket: 'output',
    name: 'output',
    type: eventSocket,
  },
  {
    socket: 'trigger',
    name: 'trigger',
    type: triggerSocket,
  }
]

const outputSockets = [
  {
    socket: 'output',
    name: 'output',
    type: eventSocket,
  }
]

const DiscordPlugin = new ClientPlugin({
  name: 'DiscordPlugin',
  agentComponents: [DiscordAgentWindow],
  spellTemplates: [DiscordSpellTemplate],
  inputTypes: [
    { name: 'Discord (Voice)', sockets: inputSockets },
    { name: 'Discord (Text)', sockets: inputSockets },
  ],
  outputTypes: [
    { name: 'Discord (Voice)', sockets: outputSockets },
    { name: 'Discord (Text)', sockets: outputSockets },
  ],
  secrets: [{
    name: 'Discord API Key',
    key: 'discord_api_key',
    global: false
  }]
})

export default DiscordPlugin
