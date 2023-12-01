// DOCUMENTED
/**
 * @fileoverview A module that exports an optimized version of the original Typescript module
 * that conforms to the Google code standards.
 * @module optimized-ts
 */

import { ServerPlugin } from 'shared/core'
import Nodes from '@magickml/plugin-ethereum-shared'
import { solidity } from './services/solidity/solidity'

/**
 * An object containing the arguments to start the Ethereum websocket.
 * @typedef {Object} StartEthereumArgs
 * @property {any} agent - The agent.
 * @property {any} spellRunner - The spell runner.
 */

/**
 * A module that contains various helper functions for the Ethereum plugin.
 * @module getAgentMethods
 */

/**
 * Returns an object containing the start and stop functions for the Ethereum
 * websocket.
 * @function
 * @returns {Object} An object containing the start and stop functions for the
 * Ethereum websocket.
 */
function getAgentMethods() {
  // If we are in node, we need to import the Ethereum client.
  if (typeof window !== 'undefined') return

  let ethereum_client

  /**
   * Starts the Ethereum websocket.
   * @async
   * @function
   * @param {StartEthereumArgs} args - The arguments to start the Ethereum websocket.
   * @returns {void}
   */
  async function startEthereumWs({ agent, spellRunner }) {
    console.log('Starting Ethereum WS...')
    // Ignore import if using Vite.
    const module = await import(
      /* @vite-ignore */ `${
        typeof window === 'undefined' ? './connectors/ethereum' : './dummy'
      }`
    )
    ethereum_client = module.ethereum_client

    const ethereum = new ethereum_client()
    agent.ethereum = ethereum
    await ethereum.createEthereumClient(agent, spellRunner)
  }

  /**
   * Stops the Ethereum websocket.
   * @async
   * @function
   * @param {any} agent - The agent.
   * @returns {void}
   */
  async function stopEthereumWs(agent) {
    if (!agent.ethereum) return
    await agent.ethereum.destroy()
    agent.ethereum = null
    console.log(`Stopped Ethereum WS client for agent ${agent.name}.`)
  }

  return {
    start: startEthereumWs,
    stop: stopEthereumWs,
  }
}

/**
 * The Ethereum plugin object.
 * @constant
 * @type {ServerPlugin}
 */
const EthereumPlugin = new ServerPlugin({
  name: 'EthereumPlugin',
  nodes: Nodes,
  services: [solidity],
  agentMethods: getAgentMethods(),
  secrets: [
    {
      name: 'Ethereum Private Key',
      key: 'ethereum_private_key',
      global: false,
    },
    {
      name: 'Ethereum Public Address',
      key: 'ethereum_public_address',
      global: false,
    },
  ],
})

export default EthereumPlugin
