import { ServerPlugin } from "@magickml/engine"
import { RestApiService } from './services/rest-api/rest-api.class'

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
  services: {'RestPlugin': RestApiService},
  serverInit: null,
  serverRoutes: null,
  agentMethods: getAgentMethods(),
  inputTypes: ['REST API (GET)', 'REST API (POST)', 'REST API (PUT)', 'REST API (PATCH)', 'REST API (DELETE)'],
  outputTypes: ['REST API (Response)'],
})

export default RestPlugin;