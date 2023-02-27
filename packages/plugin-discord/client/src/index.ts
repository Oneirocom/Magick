import { ClientPlugin, WorldManager } from "@magickml/engine"
import { DiscordAgentWindow } from "./components/agent.component"

const DiscordPlugin = new ClientPlugin({
  name: 'DiscordPlugin', 
  nodes: [],
  inputTypes: ['Discord (Voice)', 'Discord (Text)'],
  outputTypes: ['Discord (Voice)', 'Discord (Text)'],
})

export default DiscordPlugin;