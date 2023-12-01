// DOCUMENTED
/**
 * Represents the Pinecone plugin for the MagickML engine.
 * @class
 */
import { ClientPlugin } from 'shared/core'
import Nodes from '@magickml/plugin-pinecone-shared'

const PineconePlugin = new ClientPlugin({
  name: 'PineconePlugin',
  nodes: Nodes,
  secrets: [
    {
      /**
       * Name of the Pinecone API key.
       * @type {string}
       */
      name: 'Pinecone API Key',

      /**
       * Key that is used to identify the Pinecone API key.
       * @type {string}
       */
      key: 'pinecone_api_key',

      /**
       * Whether the key is global or not.
       * @type {boolean}
       */
      global: true,

      /**
       * URL that is used to retrieve the Pinecone API key.
       * @type {string}
       */
      getUrl: 'https://app.pinecone.io/',
    },
  ],
})

export default PineconePlugin
