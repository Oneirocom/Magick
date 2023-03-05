import { ServerPlugin } from '@magickml/engine'

const BananaPlugin = new ServerPlugin({
  name: 'BananaPlugin',
  secrets: [
    {
      name: 'Banana API Key',
      key: 'banana_api_key',
      global: true,
    },
  ],
})

export default BananaPlugin
