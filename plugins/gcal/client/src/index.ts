// DOCUMENTED 
/**
 * The `ClientPlugin` interface represents a plugin used by the application.
 * @interface
 */
import { ClientPlugin } from '@magickml/core';

/**
 * This is the `Nodes` object from the gcal shared plugin.
 * @typedef {object} Nodes
 */
import { getNodes } from '@magickml/plugin-gcal-shared';

/**
 * Represents a gcal plugin usable by clients.
 */
const GcalPlugin = new ClientPlugin({
  name: 'GcalPlugin',
  nodes: getNodes()
});

export default GcalPlugin;