import { ClientPlugin } from '@magickml/engine'
import { EthereumAgentWindow } from './components/agent.component'
import Nodes from '@magickml/plugin-ethereum-shared'
import Money from '@mui/icons-material/AttachMoney'

import { EthereumComponent } from './components/ethereum.route'
import { ContractComponent } from './components/contract.route'

type StartEthereumArgs = {
  agent: any
  spellRunner: any
}

const EthereumPlugin = new ClientPlugin({
  name: 'EthereumPlugin',
  nodes: Nodes,
  agentComponents: [EthereumAgentWindow],
  drawerItems: [
    {
      path: '/ethereum/',
      icon: Money,
      text: 'Ethereum',
    },
  ],
  clientRoutes: [
    {
      path: "/ethereum/",
      component: EthereumComponent,
    },
    {
      path: "/ethereum/contract/:chain/:address/:function",
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
    }
  ]
})

export default EthereumPlugin
