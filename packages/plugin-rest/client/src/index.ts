import { ClientPlugin, eventSocket, anySocket, triggerSocket } from '@magickml/engine'
import { RestAgentWindow } from './components/rest.component'

import RestSpellTemplate from './templates/spells/REST API.spell.json'

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

const outputSockets = [
  {
    socket: 'output',
    name: 'output',
    type: eventSocket,
  }
]

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
  outputTypes: [
    { name: 'REST API (Response)', sockets: outputSockets },
  ],
})

export default RestPlugin
