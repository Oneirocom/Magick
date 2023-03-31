// DOCUMENTED 
/**
 * Class representing a server plugin for search functionality
 */
import { ServerPlugin } from "@magickml/engine"

/**
 * Nodes that are shared between search plugins
 */
import Nodes from '@magickml/plugin-search-shared'

/**
 * Service for Google search functionality
 */
import { googleSearch } from './services/google-search/google-search'

/**
 * Create a new instance of the SearchPlugin class
 */
const SearchPlugin = new ServerPlugin({
  name: 'SearchPlugin',
  nodes: Nodes,
  services: [googleSearch]
})

export default SearchPlugin;