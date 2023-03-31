// DOCUMENTED 
/**
 * The `ClientPlugin` interface represents a plugin used by the application.
 * @interface
 */
import { ClientPlugin } from '@magickml/engine';

/**
 * This is the `Nodes` object from the search shared plugin.
 * @typedef {object} Nodes
 */
import Nodes from '@magickml/plugin-search-shared';

/**
 * Represents a search plugin usable by clients.
 */
const SearchPlugin = new ClientPlugin({
  name: 'SearchPlugin',
  nodes: Nodes
});

export default SearchPlugin;