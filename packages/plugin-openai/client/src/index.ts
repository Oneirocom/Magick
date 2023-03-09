import { ClientPlugin } from '@magickml/engine'

const OpenAIPlugin = new ClientPlugin({
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
