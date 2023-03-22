import { ClientPlugin } from '@magickml/engine'
import Nodes from '@magickml/plugin-pinecone-shared'

const PineconePlugin = new ClientPlugin({
  name: 'PineconePlugin',
  nodes: Nodes,
  secrets: [
    {
      name: 'Pinecone API Key',
      key: 'pinecone_api_key',
      global: true,
      getUrl: 'https://app.pinecone.io/'
    }
  ],
})

export default PineconePlugin
