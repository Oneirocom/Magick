import {
  ClientPlugin,
  eventSocket,
  triggerSocket,
} from '@magickml/core'
import { BlueskyAgentWindow } from './components/agent.component'


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

const BlueskyPlugin = new ClientPlugin({
  name: 'BlueskyPlugin',
  agentComponents: [BlueskyAgentWindow],
  inputTypes: [
    { name: 'Bluesky (Feed)', sockets: inputSockets},
    // { name: 'Bluesky (DM)', trigger: true, socket: eventSocket },
    // { name: 'Bluesky (Mention)', trigger: true, socket: eventSocket },
  ],
  outputTypes: [
    { name: 'Bluesky (Feed)', sockets: outputSockets },
    // { name: 'Bluesky (DM)', trigger: false, socket: eventSocket },
    // { name: 'Bluesky (Mention)', trigger: false, socket: eventSocket },
  ],
  secrets: [
    {
    name: 'Bearer Token (API v2)',
    key: 'bluesky_bearer_token',
    global: false
  },
  {
    name: 'API Key (API v1)',
    key: 'bluesky_api_key',
    global: false
  },
  {
    name: 'API Key Secret (API v1)',
    key: 'bluesky_api_key_secret',
    global: false
  },
  {
    name: 'Access Token (API v1)',
    key: 'bluesky_access_token',
    global: false
  },
  {
    name: 'Access Token Secret (API v1)',
    key: 'bluesky_access_token_secret',
    global: false
  }
]
})

export default BlueskyPlugin
