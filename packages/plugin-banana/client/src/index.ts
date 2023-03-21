import { ClientPlugin } from '@magickml/engine'

const BananaPlugin = new ClientPlugin({
  name: 'BananaPlugin',
  secrets: [
    // {
    //   name: 'Banana API Key',
    //   key: 'banana_api_key',
    //   global: true,
    // },
  ],
})

export default BananaPlugin
