import { Plugin } from "@magickml/engine"
import { EthereumAgentWindow } from "./components/agent.component"
import { Solidity } from "./nodes/Solidity"
import { GetRecentTransactions } from "./nodes/GetRecentTransactions"
import { DeployContract } from "./nodes/DeployContract"
import { CheckForRecentTransactionsFromWallet } from "./nodes/CheckForRecentTransactionsFromWallet"
import { CheckEthBalance } from "./nodes/CheckEthBalance"
import { CheckBalanceForERC20 } from "./nodes/CheckBalanceForERC20"
import { CallContractFunctionWrite } from "./nodes/CallContractFunctionWrite"
import { CallContractFunctionRead } from "./nodes/CallContractFunctionRead"

import { EthereumComponent } from "./components/ethereum.route"

type StartEthereumArgs = {
  agent: any,
  spellRunner: any
}

function getAgentMethods() {
  // if we are in node, we need to import the ethereum client
  if(typeof window !== 'undefined') return

  let ethereum_client

  async function startEthereumWs({
    agent,
    spellRunner,
  }: StartEthereumArgs) {
    console.log('starting ethereum ws')
    // ignore import if vite
    const module = await import(/* @vite-ignore */ `${typeof window === 'undefined' ? './connectors/ethereum' : './dummy'}`)
    ethereum_client = module.ethereum_client

    const ethereum = new ethereum_client()
    agent.ethereum = ethereum
    await ethereum.createEthereumClient(
      agent,
      spellRunner,
    )
  }

  async function stopEthereumWs(agent) {
    if (!agent.ethereum) throw new Error("Ethereum WS isn't running, can't stop it")
    await agent.ethereum.destroy()
    agent.ethereum = null
    console.log('Stopped Ethereum WS client for agent ' + agent.name)
  }

  return {
    start: startEthereumWs,
    stop: stopEthereumWs,
  }
}

const EthereumPlugin = new Plugin({
  name: 'EthereumPlugin',
  nodes: [Solidity, GetRecentTransactions, DeployContract, CheckForRecentTransactionsFromWallet, CheckEthBalance, CheckBalanceForERC20, CallContractFunctionWrite, CallContractFunctionRead],
  services: [['EthereumPlugin']],
  agentComponents: [EthereumAgentWindow],
  agentMethods: getAgentMethods(),
  clientRoutes: [{
    path: '/ethereum',
    component: EthereumComponent,
  }],
})

export default EthereumPlugin;
