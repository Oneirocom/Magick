import Rete from 'rete'
import { v4 as uuidv4 } from 'uuid'

import {
  anySocket,
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

const info = `Call a write function from a contract`

type InputReturn = {
  output: unknown
}

export class CallContractFunctionWrite extends MagickComponent<InputReturn> {
  constructor() {
    // Name of the component
<<<<<<< refs/remotes/origin/development
    super('Contract Write')
=======
    super('PluginEthCallContractFunctionWrite')
>>>>>>> plugin(eth): change node's names and display names

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
<<<<<<< refs/remotes/origin/development
    this.contextMenuName = 'Contract Write'
    this.displayName = 'Contract Write'
=======
    this.contextMenuName = 'Call Contract Write'
    this.displayName = 'Call Contract Write-Function'
>>>>>>> plugin(eth): change node's names and display names
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
      'Contract Addr',
      stringSocket
    )
    const abiInput = new Rete.Input('abi', 'ABI', anySocket)
    const chainIdInput = new Rete.Input('chain_id', 'Chain ID', numberSocket)
    const functionNameInput = new Rete.Input(
      'function_name',
      'Func Name',
      stringSocket
    )
    const functionArgsInput = new Rete.Input(
      'function_args',
      'Func Params',
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
    inputs: MagickWorkerInputs,
    outputs: MagickWorkerOutputs,
    { data }: { data: string | undefined }
  ) {
    let chainId = 80001
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

    const contractAddress = (inputs['contract_addr'] && inputs['contract_addr'][0]) as string
    const functionName = (inputs['function_name'] && inputs['function_name'][0]) as string

      return {
        output: data,
      }
    }

    return {
      output: `http://localhost:4200/ethereum/contract/${chainId}/${contractAddress}/${functionName}`,
    }
  }
}
