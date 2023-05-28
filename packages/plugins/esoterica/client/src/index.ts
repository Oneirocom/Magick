// DOCUMENTED 
/**
 * A Typescript module that exports an instance of a ClientPlugin class named EsotericaPlugin.
 * @packageDocumentation
 */

import { ClientPlugin } from '@magickml/core';
import Nodes from '@magickml/plugin-esoterica-shared';

/**
 * An instance of a ClientPlugin class.
 * 
 * The exported EsotericaPlugin is created by constructing a new instance of a ClientPlugin class.
 * The constructor of the ClientPlugin class takes an object as its argument with two properties: name and nodes.
 * 
 * The property `name` is a string that will be displayed in the user interface for identification purposes.
 * 
 * The property `nodes` is an array of Node objects required in order to add functionality.
 *  
 * @example
 * 
 * import EsotericaPlugin from './esoterica-plugin';
 *
 * // use the plugin instance
 * 
 */
const EsotericaPlugin = new ClientPlugin({
  name: 'EsotericaPlugin',
  nodes: Nodes,
});

export default EsotericaPlugin;