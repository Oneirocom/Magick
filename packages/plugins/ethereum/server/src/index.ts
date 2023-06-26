// DOCUMENTED
/**
 * Server module for the Ethereum plugin.
 *
 * Custom server component made to extend the functionality of the Ethereum plugin.
 * It allows adding new features to agent.
 *
 * @packageDocumentation
 */

import { ServerPlugin } from "@magickml/core";
import { getNodes } from '@magickml/plugin-ethereum-shared'
import { solidity } from "./services/solidity/solidity";

/**
 * An Ethereum instance of the ServerPlugin class with services.
 * @constant
 * @public
 * @type {ServerPlugin}
 */
const EthereumPlugin = new ServerPlugin({
  name: "EthereumPlugin",
  nodes: getNodes(),
  services: [solidity],
  secrets: [],
});

export default EthereumPlugin;
