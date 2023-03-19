import { ServerPlugin } from "@magickml/engine"
import Nodes from '@magickml/plugin-search-shared'

const PineconePlugin = new ServerPlugin({
  name: 'PineconePlugin',
  nodes: Nodes,
  secrets: [
    {
      name: 'Pinecone API Key',
      key: 'pinecone_api_key',
      global: true,
    }
  ],
})

export default PineconePlugin;
