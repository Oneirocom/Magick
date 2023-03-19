import { ServerPlugin } from "@magickml/engine"
import Nodes from '@magickml/plugin-search-shared'

const SearchPlugin = new ServerPlugin({
  name: 'SearchPlugin',
  nodes: Nodes,
  services: [
    {
      name: 'google-search',
      
    }
  ]
})

export default SearchPlugin;
