import { ServerPlugin } from "@magickml/engine"
import Nodes from '@magickml/plugin-search-shared'
import { googleSearch } from './services/google-search/google-search'

const SearchPlugin = new ServerPlugin({
  name: 'SearchPlugin',
  nodes: Nodes,
  services: [googleSearch]
})

export default SearchPlugin;
