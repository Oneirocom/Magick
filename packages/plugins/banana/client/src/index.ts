// DOCUMENTED
/**
 * A plugin class that extends the `ClientPlugin` and contains the `name` and `secrets`.
 * `secrets` is an array containing objects that contain names, keys, global URLs, and get URLs.
 */
import { ClientPlugin } from 'shared/core'

const BananaPlugin = new ClientPlugin({
  name: 'BananaPlugin',

  secrets: [
    {
      name: 'Banana API Key',
      key: 'banana_api_key',
      global: true,
      getUrl: 'https://app.banana.dev/',
    },
  ],
})

export default BananaPlugin
