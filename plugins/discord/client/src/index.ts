// DOCUMENTED 
/**
 * Contains the implementation of the `DiscordPlugin` class which represents
 * a client plugin that is used by the MagickML engine. The plugin provides a
 * Discord integration with MagickML.
 * @packageDocumentation
 */

import {
  ClientPlugin,
  eventSocket,
  SpellInterface,
  triggerSocket,
} from '@magickml/core'
import { DiscordAgentWindow } from './components/agent.component'

import _DiscordSpellTemplate from './templates/spells/Discord Bot.spell.json'

import Nodes, { getNodes } from '@magickml/plugin-discord-shared'
// TODO: add schema validation with e.g. zod
// Typecast `DiscordSpellTemplate` to `SpellInterface`
const DiscordSpellTemplate = _DiscordSpellTemplate as unknown as SpellInterface

/**
 * The input sockets that are accepted by the plugin.
 *
 * @remarks
 * `output` accepts events and `trigger` accepts triggers.
 */
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

/**
 * The output sockets that are returned by the plugin.
 *
 * @remarks
 * `output` returns events.
 */
const outputSockets = [
  {
    socket: 'output',
    name: 'output',
    type: eventSocket,
  }
]


/**
 * The Discord plugin implementation.
 */
const DiscordPlugin = new ClientPlugin({
  name: 'DiscordPlugin',
  nodes: getNodes(),
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