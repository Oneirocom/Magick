// DOCUMENTED
/**
 * A plugin used for the Pinecone integration with MagickML engine.
 *
 * @param name - the name of the plugin.
 * @param nodes - the nodes used by the plugin.
 * @param secrets - an array of secrets used by the plugin.
 */
import { ServerPlugin } from 'shared/core'
import Nodes from '@magickml/plugin-pinecone-shared'

const PineconePlugin = new ServerPlugin({
  name: 'PineconePlugin',
  nodes: Nodes,
  secrets: [
    {
      name: 'Pinecone API Key',
      key: 'pinecone_api_key',
      global: true,
      getUrl: 'https://app.pinecone.io/',
    },
  ],
})

export default PineconePlugin
