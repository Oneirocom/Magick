import {
  ClientPlugin,
  eventSocket,
} from '@magickml/engine'
import { TwitterAgentWindow } from './components/agent.component'

const TwitterPlugin = new ClientPlugin({
  name: 'TwitterPlugin',
  agentComponents: [TwitterAgentWindow],
  inputTypes: [
    { name: 'Twitter (Feed)', trigger: true, socket: eventSocket},
    // { name: 'Twitter (DM)', trigger: true, socket: eventSocket },
    // { name: 'Twitter (Mention)', trigger: true, socket: eventSocket },
  ],
  outputTypes: [
    { name: 'Twitter (Feed)', trigger: false, socket: eventSocket },
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
})

export default TwitterPlugin
