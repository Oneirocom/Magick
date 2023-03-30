import { ServerPlugin } from "@magickml/engine"
import Nodes from '@magickml/plugin-pinecone-shared'

const PineconePlugin = new ServerPlugin({
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

export default PineconePlugin;