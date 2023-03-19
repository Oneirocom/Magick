import { ClientPlugin } from '@magickml/engine'
import Nodes from '@magickml/plugin-openai-shared'

const OpenAIPlugin = new ClientPlugin({
  name: 'OpenAIPlugin',
  nodes: Nodes,
  secrets: [
    {
      name: 'OpenAI API Key',
      key: 'openai_api_key',
      global: true,
    },
  ],
})

export default OpenAIPlugin
