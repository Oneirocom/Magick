import { isEmpty } from 'lodash'
import Rete from 'rete'
import { v4 as uuidv4 } from 'uuid'

import {
  anySocket,
  MagickComponent,
  MagickNode,
  MagickTask,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  NodeData,
  DropdownControl,
  stringSocket,
  numberSocket,
  triggerSocket,
} from '@magickml/engine'

const info = `Call a write function from a contract`

type InputReturn = {
  output: unknown
}

export class CallContractFunctionWrite extends MagickComponent<InputReturn> {
  constructor() {
    // Name of the component
    super('CallContractFunctionWrite')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
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
    this.contextMenuName = 'CallContractFunctionWrite'
    this.displayName = 'CallContractFunctionWrite'
  }

  destroyed(node: MagickNode) {
    console.log('destroyed', node.id)
  }

  builder(node: MagickNode) {
    // module components need to have a socket key.
    // todo add this somewhere automated? Maybe wrap the modules builder in the plugin
    node.data.socketKey = node?.data?.socketKey || uuidv4()

    const chainIdControl = new DropdownControl({
      name: 'Chain',
      dataKey: 'chain_id',
      values: ['1', '11155111', '5', '137', '80001'],
      defaultValue: '80001',
      write: true,
    })

    node.inspector.add(chainIdControl)

    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const contractAddressInput = new Rete.Input(
      'contract_addr',
      'Contract Address',
      stringSocket
    )
    const abiInput = new Rete.Input('abi', 'ABI', anySocket)
    const chainIdInput = new Rete.Input('chain_id', 'Chain ID', numberSocket)
    const functionNameInput = new Rete.Input(
      'function_name',
      'Function Name',
      stringSocket
    )
    const functionArgsInput = new Rete.Input(
      'function_args',
      'Function Arguments',
      stringSocket
    )
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const urlOutput = new Rete.Output('output', 'Output', stringSocket)

    return node
      .addInput(dataInput)
      .addInput(abiInput)
      .addInput(chainIdInput)
      .addInput(functionNameInput)
      .addInput(functionArgsInput)
      .addInput(contractAddressInput)
      .addOutput(dataOutput)
      .addOutput(urlOutput)
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async worker(
    node: NodeData,
    _inputs: MagickWorkerInputs,
    outputs: MagickWorkerOutputs,
    { data }: { data: string | undefined }
  ) {
    this._task.closed = ['trigger']
    console.log('********* processing input to ethereum input *********')
    console.log(data)

    // handle data subscription.  If there is data, this is from playtest
    if (data && !isEmpty(data)) {
      this._task.closed = []

      return {
        output: data,
      }
    }
  }
}
