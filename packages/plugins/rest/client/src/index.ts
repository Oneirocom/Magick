// DOCUMENTED
/**
 * This module contains a Typescript script for a RestPlugin ClientPlugin.
 * The plugin allows access to REST API through GET, POST, PUT, and DELETE requests.
 */

import { ClientPlugin, eventSocket, triggerSocket } from 'shared/core'

import { RestAgentWindow } from './components/rest.component'
import RestSpellTemplate from './templates/spells/REST API.spell.json'

/**
 * Input sockets that are common to all REST API request types.
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
  },
]

/**
 * Output sockets that are common to all REST API response types.
 */
const outputSockets = [
  {
    socket: 'output',
    name: 'output',
    type: eventSocket,
  },
]

/**
 * The RestPlugin client plugin.
 */
const RestPlugin = new ClientPlugin({
  name: 'RestPlugin',
  agentComponents: [RestAgentWindow],
  spellTemplates: [RestSpellTemplate],
  inputTypes: [
    { name: 'REST API (GET)', sockets: inputSockets },
    { name: 'REST API (POST)', sockets: inputSockets },
    { name: 'REST API (PUT)', sockets: inputSockets },
    { name: 'REST API (DELETE)', sockets: inputSockets },
  ],
  outputTypes: [{ name: 'REST API (Response)', sockets: outputSockets }],
})

export default RestPlugin
