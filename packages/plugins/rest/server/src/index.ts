// DOCUMENTED
/**
 * An object representing input sockets.
 * @typedef {Object} InputSocket
 * @property {string} socket - The socket type.
 * @property {string} name - The socket name.
 * @property {string} type - The socket type, either `eventSocket` or `triggerSocket`.
 */

/**
 * An object representing output sockets.
 * @typedef {Object} OutputSocket
 * @property {string} socket - The socket type.
 * @property {string} name - The socket name.
 * @property {string} type - The socket type, always `eventSocket`.
 */

import { eventSocket, ServerPlugin, triggerSocket } from 'shared/core'
import { agentHttp } from './services/agentHttp/agentHttp'

/**
 * An array of input sockets.
 * @type {InputSocket[]}
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
 * An array of output sockets.
 * @type {OutputSocket[]}
 */
const outputSockets = [
  {
    socket: 'output',
    name: 'output',
    type: eventSocket,
  },
]

/**
 * A class representing the REST plugin.
 */
class RestPlugin extends ServerPlugin {
  /**
   * Creates an instance of RestPlugin.
   */
  constructor() {
    super({
      name: 'RestPlugin',
      services: [agentHttp],
      inputTypes: [
        { name: 'REST API (GET)', sockets: inputSockets },
        { name: 'REST API (POST)', sockets: inputSockets },
        { name: 'REST API (PUT)', sockets: inputSockets },
        { name: 'REST API (DELETE)', sockets: inputSockets },
      ],
      outputTypes: [{ name: 'REST API (Response)', sockets: outputSockets }],
    })
  }
}

export default new RestPlugin() // Return an instance of the class instead of the class itself.
