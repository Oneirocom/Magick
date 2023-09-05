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

import { eventSocket, ServerPlugin, triggerSocket } from '@magickml/core'
import { slack } from './services/slack/slack'

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
 * A class representing the Slack plugin.
 */
class SlackPlugin extends ServerPlugin {
  /**
   * Creates an instance of SlackPlugin.
   */
  constructor() {
    super({
      name: 'SlackPlugin',
      services: [slack],
      inputTypes: [
        { name: 'Slack (Message)', sockets: inputSockets },
        { name: 'Slack (Mention)', sockets: inputSockets },
      ],
      outputTypes: [{ name: 'Slack (Response)', sockets: outputSockets }],
    })
  }
}

export default new SlackPlugin() // Return an instance of the class instead of the class itself.
