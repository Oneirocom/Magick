// DOCUMENTED
/**
 * A ServerPlugin that adds the BananaPlugin with a single secret - API key.
 */
import { ServerPlugin } from 'shared/core'

const BananaPlugin = new ServerPlugin({
  name: 'BananaPlugin',
  // The list of secrets required by the 'BananaPlugin'.
  secrets: [
    {
      name: 'Banana API Key',
      key: 'banana_api_key',
      global: true,
    },
  ],
})

export default BananaPlugin
