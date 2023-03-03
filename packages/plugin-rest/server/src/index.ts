import { ServerPlugin } from "@magickml/engine"
import { ApiService } from './services/api/api.class'

function getAgentMethods() {

  return {
    start: () => {
      console.log('starting rest')
    },
    stop: () => {
      console.log('stopping rest')
    },
  }
}

const RestPlugin = new ServerPlugin({
  name: 'RestPlugin', 
  nodes: [], 
  services: {'RestPlugin': ApiService},
  agentMethods: getAgentMethods(),
  inputTypes: ['REST API (GET)', 'REST API (POST)', 'REST API (PUT)', 'REST API (PATCH)', 'REST API (DELETE)'],
  outputTypes: ['REST API (Response)'],
})

export default RestPlugin;