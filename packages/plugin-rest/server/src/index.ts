import { anySocket, eventSocket, ServerPlugin, triggerSocket } from '@magickml/engine'
import { api } from './services/api/api'

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

const RestPlugin = new ServerPlugin({
  name: 'RestPlugin',
  services: [ api ],
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
