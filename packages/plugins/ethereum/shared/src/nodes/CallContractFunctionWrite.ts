// DOCUMENTED
import Rete from 'shared/rete'
import { v4 as uuidv4 } from 'uuid'

import {
  anySocket,
  MagickComponent,
  MagickNode,
  MagickWorkerInputs,
  DropdownControl,
  stringSocket,
  numberSocket,
  triggerSocket,
  WorkerData,
} from '@magickml/core'

/** Info for the component */
const info = `Call a write function from a contract`

/** Type for the return value of InputReturn */
type InputReturn =
  | {
      output: string
    }
  | undefined

/**
 * ContractFunctionWrite Component derived from MagickComponent
 */
export class CallContractFunctionWrite extends MagickComponent<
  Promise<InputReturn>
> {
  constructor() {
    // Name of the component
    super(
      'Contract Write',
      {
        outputs: {
          output: 'output',
          trigger: 'option',
        },
      },
      'Ethereum',
      info
    )

    this.module = {
      nodeType: 'triggerIn',
      socket: anySocket,
    }

    this.contextMenuName = 'Contract Write'
    this.displayName = 'Contract Write'
  }

  /**
   * Function to handle the destruction/cleanup of the node
   * @param node {MagickNode} The current node
   */
  destroyed(node: MagickNode) {
    console.log('destroyed', node.id)
  }

  /**
   * Function to build the contract-write node
   * @param node {MagickNode} The current node
   * @returns MagickNode Builder for the node
   */
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

  /**
   * Function represents the worker which processes incoming data
   * @param node {WorkerData} Current node's data
   * @param inputs {MagickWorkerInputs} Inputs received from the UI
   * @returns Object containing the output of the worker
   */
  async worker(node: WorkerData, inputs: MagickWorkerInputs) {
    let chainId = 80001
    if (node.data?.chain_id) {
      const parsed = parseInt(node.data?.chain_id as string)
      if (!isNaN(parsed)) {
        chainId = parsed
      }
    }
    if (inputs['chain_id']) {
      const parsed = parseInt(inputs['chain_id'][0] as string)
      if (!isNaN(parsed)) {
        chainId = parsed
      }
    }

    const contractAddress = (inputs['contract_addr'] &&
      inputs['contract_addr'][0]) as string
    const functionName = (inputs['function_name'] &&
      inputs['function_name'][0]) as string

    return {
      output: `/ethereum/contract/${chainId}/${contractAddress}/${functionName}`,
    }
  }
}
