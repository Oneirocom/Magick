import { Plugin } from "@magickml/engine"
import { RestAgentWindow } from "./components/rest.component"
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

const RestPlugin = new Plugin({
  name: 'RestPlugin', 
  nodes: [], 
  services: {'RestPlugin': RestApiService},
  agentComponents: [RestAgentWindow], 
  windowComponents: [],
  serverInit: null,
  serverRoutes: null,
  agentMethods: getAgentMethods(),
  inputTypes: ['REST API (GET)', 'REST API (POST)', 'REST API (PUT)', 'REST API (PATCH)', 'REST API (DELETE)'],
  outputTypes: ['REST API (Response)'],
})

export default RestPlugin;