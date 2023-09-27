// DOCUMENTED
/**
 * This is a Typescript module that exports a ClientPlugin instance named EthereumPlugin
 *
 * A ClientPlugin is a custom component made to extend the functionality of MagickML. It allows adding new features
 * by providing new nodes, components and routes, among other things.
 *
 * The plugin provides a new node library, agent components, drawer items, client routes, and secrets relevant to Ethereum blockchain.
 *
 * @packageDocumentation
 */

import { ClientPlugin } from 'shared/core'
import { EthereumAgentWindow } from './components/agent.component'
import Nodes from '@magickml/plugin-ethereum-shared'
import MoneyIcon from '@mui/icons-material/AttachMoney'
import { EthereumComponent } from './components/ethereum.route'
import { ContractComponent } from './components/contract.route'

/**
 * An object of the StartEthereumArgs type.
 * @typedef {Object} StartEthereumArgs
 * @property {any} agent - An agent.
 * @property {any} spellRunner - A spell publisher.
 */

/**
 * An instance of the ClientPlugin class with the properties needed to extend the MagickML functionality for Ethereum users.
 * @public
 */
const EthereumPlugin = new ClientPlugin({
  name: 'EthereumPlugin',
  nodes: Nodes,
  agentComponents: [EthereumAgentWindow],
  drawerItems: [
    {
      path: '/ethereum/',
      icon: MoneyIcon,
      text: 'Ethereum',
    },
  ],
  clientRoutes: [
    {
      path: '/ethereum/',
      component: EthereumComponent,
    },
    {
      path: '/ethereum/contract/:chain/:address/:function',
      component: ContractComponent,
    },
  ],
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
