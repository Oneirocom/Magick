import { ClientPlugin } from '@magickml/engine'
import Nodes from '@magickml/plugin-search-shared'

const SearchPlugin = new ClientPlugin({
  name: 'SearchPlugin',
  nodes: Nodes
})

export default SearchPlugin
