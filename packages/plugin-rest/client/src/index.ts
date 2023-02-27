import { ClientPlugin } from "@magickml/engine"
import { RestAgentWindow } from "./components/rest.component"

const RestPlugin = new ClientPlugin({
  name: 'RestPlugin', 
  nodes: [], 
  agentComponents: [RestAgentWindow],
  inputTypes: ['REST API (GET)', 'REST API (POST)', 'REST API (PUT)', 'REST API (PATCH)', 'REST API (DELETE)'],
  outputTypes: ['REST API (Response)'],
})

export default RestPlugin;