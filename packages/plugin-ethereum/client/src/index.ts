import { ClientPlugin } from '@magickml/engine'
import { EthereumAgentWindow } from './components/agent.component'
import Nodes from '@magickml/plugin-ethereum-shared'
import { Solidity } from './nodes/Solidity'
import { GetRecentTransactions } from './nodes/GetRecentTransactions'
import { DeployContract } from './nodes/DeployContract'
import { CheckForRecentTransactionsFromWallet } from './nodes/CheckForRecentTransactionsFromWallet'
import { CheckEthBalance } from './nodes/CheckEthBalance'
import { CheckBalanceForERC20 } from './nodes/CheckBalanceForERC20'
import { CallContractFunctionWrite } from './nodes/CallContractFunctionWrite'
import { CallContractFunctionRead } from './nodes/CallContractFunctionRead'
import Money from '@mui/icons-material/Money'

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
      path: '/ethereum',
      icon: Money,
      text: 'Ethereum',
    },
  ],
  clientRoutes: [
    {
      path: '/ethereum',
      component: EthereumComponent,
    },
  ],
})

export default EthereumPlugin
