import {
  ClientPlugin,
  eventSocket,
  SpellInterface,
} from '@magickml/engine'
import { DiscordAgentWindow } from './components/agent.component'

import _DiscordSpellTemplate from './templates/spells/Discord Bot.spell.json'

// TODO: add schema validation with e.g. zod
const DiscordSpellTemplate = _DiscordSpellTemplate as unknown as SpellInterface

const DiscordPlugin = new ClientPlugin({
  name: 'DiscordPlugin',
  agentComponents: [DiscordAgentWindow],
  spellTemplates: [DiscordSpellTemplate],
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
