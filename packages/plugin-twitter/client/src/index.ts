// GENERATED 
/**
 * @file This file contains a Typescript module for the Twitter plugin.
 * @module TwitterPlugin
 * @version 1.0.0
 */

import { ClientPlugin, eventSocket, triggerSocket } from '@magickml/engine';
import { TwitterAgentWindow } from './components/agent.component';

/**
 * An array of input sockets.
 *
 * @type {Object[]}
 * @property {string} socket - The socket name.
 * @property {string} name - The socket display name.
 * @property {eventSocket|triggerSocket} type - The type of input socket.
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
];

/**
 * An array of output sockets.
 *
 * @type {Object[]}
 * @property {string} socket - The socket name.
 * @property {string} name - The socket display name.
 * @property {eventSocket|triggerSocket} type - The type of output socket.
 */
const outputSockets = [
  {
    socket: 'output',
    name: 'output',
    type: eventSocket,
  }
];

/**
 * The Twitter plugin object.
 *
 * @type {ClientPlugin}
 * @property {string} name - The name of the plugin.
 * @property {TwitterAgentWindow[]} agentComponents - An array of agent components.
 * @property {Object[]} inputTypes - An array of input types.
 * @property {Object[]} outputTypes - An array of output types.
 * @property {Object[]} secrets - An array of secret keys.
 */
const TwitterPlugin: ClientPlugin = new ClientPlugin({
  name: 'TwitterPlugin',
  agentComponents: [TwitterAgentWindow],
  inputTypes: [
    { name: 'Twitter (Feed)', sockets: inputSockets},
    // { name: 'Twitter (DM)', trigger: true, socket: eventSocket },
    // { name: 'Twitter (Mention)', trigger: true, socket: eventSocket },
  ],
  outputTypes: [
    { name: 'Twitter (Feed)', sockets: outputSockets },
    // { name: 'Twitter (DM)', trigger: false, socket: eventSocket },
    // { name: 'Twitter (Mention)', trigger: false, socket: eventSocket },
  ],
  secrets: [
    {
      name: 'Bearer Token (API v2)',
      key: 'twitter_bearer_token',
      global: false
    },
    {
      name: 'API Key (API v1)',
      key: 'twitter_api_key',
      global: false
    },
    {
      name: 'API Key Secret (API v1)',
      key: 'twitter_api_key_secret',
      global: false
    },
    {
      name: 'Access Token (API v1)',
      key: 'twitter_access_token',
      global: false
    },
    {
      name: 'Access Token Secret (API v1)',
      key: 'twitter_access_token_secret',
      global: false
    }
  ]
});

export default TwitterPlugin;