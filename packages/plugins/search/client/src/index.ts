// DOCUMENTED
/**
 * The `ClientPlugin` interface represents a plugin used by the application.
 * @interface
 */
import { ClientPlugin } from 'shared/core'

/**
 * This is the `Nodes` object from the search shared plugin.
 * @typedef {object} Nodes
 */
import { getNodes, secrets } from '@magickml/plugin-search-shared'

/**
 * Represents a search plugin usable by clients.
 */
const SearchPlugin = new ClientPlugin({
  name: 'SearchPlugin',
  nodes: getNodes(),
  secrets,
})

export default SearchPlugin
