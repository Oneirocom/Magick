import { anySocket, eventSocket, ServerPlugin } from '@magickml/engine'
import { api } from './services/api/api'

const RestPlugin = new ServerPlugin({
  name: 'RestPlugin',
  services: { api },
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
