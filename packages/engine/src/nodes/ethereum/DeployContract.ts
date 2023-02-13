/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as ethers from 'ethers'
import Rete from 'rete'

import {
  NodeData,
  MagickNode,
  MagickWorkerInputs,
} from '../../types'
import { InputControl } from '../../dataControls/InputControl'
import { DropdownControl } from '../../dataControls/DropdownControl'
import { triggerSocket, numSocket, stringSocket, anySocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'

const info = 'Deploys a contract from Solidity code, a standard for defining non-fungible tokens on EVM machines.'

export class DeployContract extends MagickComponent<void> {
  constructor() {
    super('Deploy Contract')

    this.task = {
      outputs: {
        trigger: 'option',
        balance: 'output',
        balance_after: 'output',
        tx: 'output',
        contract: 'output'
      },
    }

    this.category = 'Ethereum'
    this.display = true
    this.info = info
  }

  builder(node: MagickNode) {
    const bytecodeInput = new Rete.Input('bytecode', 'Bytecode', anySocket)
    const abiInput = new Rete.Input('abi', 'ABI', anySocket)
    const privatekeyInput = new Rete.Input('privatekey', 'Private Key', anySocket)
    const rpcHttpInput = new Rete.Input('rpc_http', 'RPC HTTP Endpoint', stringSocket)
    const chainIdInput = new Rete.Input('chain_id', 'Chain ID', numSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)

    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const balanceOutput = new Rete.Output('balance', 'Balance', numSocket)
    const balanceAfterOutput = new Rete.Output('balance_after', 'Balance After', numSocket)
    const txOutput = new Rete.Output('tx', 'Transaction', stringSocket)
    const contractAddrOutput = new Rete.Output('contract', 'Contract Address', stringSocket)

    node
      .addInput(bytecodeInput)
      .addInput(abiInput)
      .addInput(rpcHttpInput)
      .addInput(chainIdInput)
      .addInput(privatekeyInput)
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(balanceOutput)
      .addOutput(balanceAfterOutput)
      .addOutput(contractAddrOutput)
      .addOutput(txOutput)

    const rpcHttpControl = new InputControl({
      dataKey: 'rpc_http',
      name: 'RPC Endpoint',
    })

    const chainIdControl = new DropdownControl({
      name: 'Chain',
      dataKey: 'chain_id',
      values: [
        '1',
        '11155111',
        '5',
        '137',
        '80001'
      ],
      defaultValue: '80001',
    })

    node.inspector
      .add(rpcHttpControl)
      .add(chainIdControl)

    return node
  }

  async worker(node: NodeData, inputs: MagickWorkerInputs) {

    const defaultNetwork = {
      name: 'maticmaticmum',
      chainId: 80001,
      _defaultProvider: (providers) => new providers.JsonRpcProvider('https://rpc.ankr.com/polygon_mumbai')
    };

    let chainId = defaultNetwork.chainId
    if (node.data?.chain_id) {
      const parsed = parseInt(node.data?.chain_id as string);
      if (!isNaN(parsed)) {
        chainId = parsed
      }
    }
    if (inputs['chain_id']) {
      const parsed = parseInt(inputs['chain_id'][0] as string);
      if (!isNaN(parsed)) {
        chainId = parsed
      }
    }

    let provider = ethers.getDefaultProvider(defaultNetwork)
    if (node.data?.rpc_http) {
      provider = new ethers.providers.JsonRpcProvider(node.data?.rpc_http as string, chainId)
    }
    if (inputs['rpc_http']) {
      provider = new ethers.providers.JsonRpcProvider(inputs['rpc_http'][0] as string, chainId)
    }

    const privateKey = (inputs['privatekey'] && inputs['privatekey'][0]) as string
    const contractAbi = (inputs['abi'] && inputs['abi'][0]) as string
    const contractByteCode = (inputs['bytecode'] && inputs['bytecode'][0]) as string

    const wallet = new ethers.Wallet(privateKey, provider)
    const factory = new ethers.ContractFactory(contractAbi, contractByteCode, wallet);

    const balance = await provider.getBalance(wallet.address)
    const balanceInEth = ethers.utils.formatEther(balance).toString()

    const contract = await factory.deploy();
    await contract.deployTransaction.wait()

    const balanceAfter = await provider.getBalance(wallet.address)
    const balanceAfterInEth = ethers.utils.formatEther(balanceAfter).toString()

    // TODO: need to be fixed, issue of loosing display() function from NodeData context
    // node.display(balance)
    // node.display(resultInEth)

    return {
      balance: balanceInEth,
      balance_after: balanceAfterInEth,
      tx: contract.deployTransaction.hash,
      contract: contract.address
    }
  }
}
