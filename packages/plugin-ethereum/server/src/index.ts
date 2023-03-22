import { ServerPlugin } from "@magickml/engine"
import Nodes from '@magickml/plugin-ethereum-shared'
import { solidity } from "./services/solidity/solidity"

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
    if (!agent.ethereum) return
    await agent.ethereum.destroy()
    agent.ethereum = null
    console.log('Stopped Ethereum WS client for agent ' + agent.name)
  }

  return {
    start: startEthereumWs,
    stop: stopEthereumWs,
  }
}

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
    }
  ]
})

export default EthereumPlugin;
