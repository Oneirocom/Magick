import { isEmpty } from 'lodash'
import Rete from 'rete'
import { v4 as uuidv4 } from 'uuid'
import * as ethers from 'ethers'

import {
  anySocket,
  InputControl,
  MagickComponent,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  NodeData,
  DropdownControl,
  stringSocket,
  numberSocket,
  triggerSocket,
} from '@magickml/engine'

const info = `Deploys a contract from Solidity code, a standard for defining non-fungible tokens on EVM machines.`

type InputReturn = {
  output: unknown
}

export class DeployContract extends MagickComponent<InputReturn> {
  constructor() {
    // Name of the component
    super('Deploy Contract')

    this.task = {
      outputs: {
        trigger: 'option',
        balance: 'output',
        balance_after: 'output',
        tx: 'output',
        contract: 'output',
      },
    }

    this.module = {
      nodeType: 'triggerIn',
      socket: anySocket,
      hide: true,
    }

    this.category = 'Ethereum'
    this.info = info
    this.display = true
    this.contextMenuName = 'Deploy Contract'
    this.displayName = 'Deploy Contract'
  }
  builder(node: MagickNode) {
    // module components need to have a socket key.
    // todo add this somewhere automated? Maybe wrap the modules builder in the plugin
    node.data.socketKey = node?.data?.socketKey || uuidv4()

    const rpcHttpControl = new InputControl({
      dataKey: 'rpc_http',
      name: 'RPC Endpoint',
    })

    const chainIdControl = new DropdownControl({
      name: 'Chain',
      dataKey: 'chain_id',
      values: ['1', '11155111', '5', '137', '80001'],
      defaultValue: '80001',
    })

    node.inspector.add(rpcHttpControl).add(chainIdControl)

    const bytecodeInput = new Rete.Input('bytecode', 'Bytecode', anySocket)
    const abiInput = new Rete.Input('abi', 'ABI', anySocket)
    const privatekeyInput = new Rete.Input(
      'privatekey',
      'Private Key',
      anySocket
    )
    const rpcHttpInput = new Rete.Input(
      'rpc_http',
      'RPC HTTP Endpoint',
      stringSocket
    )
    const chainIdInput = new Rete.Input('chain_id', 'Chain ID', numberSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)

    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const balanceOutput = new Rete.Output('balance', 'Balance', numberSocket)
    const balanceAfterOutput = new Rete.Output(
      'balance_after',
      'Balance After',
      numberSocket
    )
    const txOutput = new Rete.Output('tx', 'Transaction', stringSocket)
    const contractAddrOutput = new Rete.Output(
      'contract',
      'Contract Address',
      stringSocket
    )

    return node
      .addInput(dataInput)
      .addInput(bytecodeInput)
      .addInput(abiInput)
      .addInput(rpcHttpInput)
      .addInput(chainIdInput)
      .addInput(privatekeyInput)
      .addOutput(dataOutput)
      .addOutput(balanceOutput)
      .addOutput(balanceAfterOutput)
      .addOutput(contractAddrOutput)
      .addOutput(txOutput)
  }

  // @ts-ignore
  async worker(
    node: NodeData,
    inputs: MagickWorkerInputs,
    outputs: MagickWorkerOutputs,
    { data }: { data: string | undefined }
  ) {
    this._task.closed = ['trigger']

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

    // TODO: check if privateKey is valid
    const wallet = new ethers.Wallet(privateKey, provider)
    const factory = new ethers.ContractFactory(contractAbi, contractByteCode, wallet);

    const balance = await provider.getBalance(wallet.address)
    const balanceInEth = ethers.utils.formatEther(balance).toString()

    const contract = await factory.deploy();
    await contract.deployTransaction.wait()

    const balanceAfter = await provider.getBalance(wallet.address)
    const balanceAfterInEth = ethers.utils.formatEther(balanceAfter).toString()

    // handle data subscription.  If there is data, this is from playtest
    if (data && !isEmpty(data)) {
      this._task.closed = []

      return {
        output: data,
        balance: balanceInEth,
        balance_after: balanceAfterInEth,
        tx: contract.deployTransaction.hash,
        contract: contract.address
      }
    }
  }
}
