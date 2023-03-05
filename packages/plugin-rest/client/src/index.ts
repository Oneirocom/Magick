import { ClientPlugin, eventSocket, anySocket } from '@magickml/engine'
import { RestAgentWindow } from './components/rest.component'

const RestPlugin = new ClientPlugin({
  name: 'RestPlugin',
  agentComponents: [RestAgentWindow],
  inputTypes: [
    { name: 'REST API (GET)', trigger: true, socket: eventSocket },
    { name: 'REST API (POST)', trigger: true, socket: eventSocket },
    { name: 'REST API (PUT)', trigger: true, socket: eventSocket },
    { name: 'REST API (DELETE)', trigger: true, socket: eventSocket },
  ],
  outputTypes: [
    { name: 'REST API (Response)', trigger: true, socket: anySocket },
  ],
})

export default RestPlugin
