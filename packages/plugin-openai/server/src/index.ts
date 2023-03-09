import { ServerPlugin } from '@magickml/engine'

const OpenAIPlugin = new ServerPlugin({
  name: 'OpenAIPlugin',
  secrets: [
    {
      name: 'OpenAI API Key',
      key: 'openai-api-key',
      global: true,
    },
  ],
})

export default OpenAIPlugin
