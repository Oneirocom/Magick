import { ClientPlugin } from '@magickml/engine'
import { EthereumAgentWindow } from './components/agent.component'
import Nodes from '@magickml/plugin-ethereum-shared'
import Money from '@mui/icons-material/AttachMoney'

import { EthereumComponent } from './components/ethereum.route'

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
      path: '/ethereum/:chain/:address/:function',
      icon: Money,
      text: 'Ethereum',
    },
  ],
  clientRoutes: [
    {
      path: "/ethereum/:chain/:address/:function",
      component: EthereumComponent,
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
