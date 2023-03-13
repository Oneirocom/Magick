import { isEmpty } from 'lodash'
import Rete from 'rete'
import { v4 as uuidv4 } from 'uuid'

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
  numSocket,
  triggerSocket,
} from '@magickml/engine'

const info = `Deploys a contract from Solidity code, a standard for defining non-fungible tokens on EVM machines.`

type InputReturn = {
  output: unknown
}

export class DeployContract extends MagickComponent<InputReturn> {
  constructor() {
    // Name of the component
    super('DeployContract')

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
    this.contextMenuName = 'DeployContract'
    this.displayName = 'DeployContract'
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
    const chainIdInput = new Rete.Input('chain_id', 'Chain ID', numSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)

    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const balanceOutput = new Rete.Output('balance', 'Balance', numSocket)
    const balanceAfterOutput = new Rete.Output(
      'balance_after',
      'Balance After',
      numSocket
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
    _inputs: MagickWorkerInputs,
    outputs: MagickWorkerOutputs,
    { silent, data }: { silent: boolean; data: string | undefined }
  ) {
    this._task.closed = ['trigger']

    // handle data subscription.  If there is data, this is from playtest
    if (data && !isEmpty(data)) {
      this._task.closed = []

      node.display(data)
      return {
        output: data,
      }
    }
  }
}
