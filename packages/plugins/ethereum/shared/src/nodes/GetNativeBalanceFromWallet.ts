// DOCUMENTED
import { isEmpty } from 'lodash'
import Rete from 'shared/rete'
import { v4 as uuidv4 } from 'uuid'

import {
  anySocket,
  InputControl,
  MagickComponent,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  DropdownControl,
  stringSocket,
  numberSocket,
  triggerSocket,
  WorkerData,
} from 'shared/core'

const info = `Check the balance of an ethereum wallet`

type InputReturn =
  | {
      output: string
    }
  | undefined

/**
 * A class representing a component to get native balance from wallet in Ethereum.
 *
 * @extends MagickComponent
 */
export class GetNativeBalanceFromWallet extends MagickComponent<
  Promise<InputReturn>
> {
  constructor() {
    // Name of the component
    super(
      'Check Eth Balance',
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

    this.contextMenuName = 'Check Eth Balance'
    this.displayName = 'Check Eth Balance'
  }

  // Log when the component is destroyed
  destroyed(node: MagickNode) {
    console.log('destroyed', node.id)
  }

  builder(node: MagickNode) {
    // Module components need to have a socket key.
    // ToDo: Add this somewhere automated? Maybe wrap the modules builder in the plugin
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

    const addressInput = new Rete.Input('address', 'Address', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const rpcHttpInput = new Rete.Input(
      'rpc_http',
      'RPC HTTP Endpoint',
      stringSocket
    )
    const chainIdInput = new Rete.Input('chain_id', 'Chain ID', numberSocket)
    const balanceOutput = new Rete.Output('output', 'Output', stringSocket)

    return node
      .addInput(dataInput)
      .addInput(addressInput)
      .addInput(rpcHttpInput)
      .addInput(chainIdInput)
      .addOutput(dataOutput)
      .addOutput(balanceOutput)
  }

  /**
   * Worker function for the component.
   * @param {WorkerData} node - The node data.
   * @param {MagickWorkerInputs} _inputs - The inputs for the component.
   * @param {MagickWorkerOutputs} outputs - The outputs for the component.
   * @param {{ data: string | undefined }} { data } - The data object.
   * @returns {undefined | { output: string }} The output object from function.
   */
  async worker(
    node: WorkerData,
    _inputs: MagickWorkerInputs,
    outputs: MagickWorkerOutputs,
    { data }: { data: string | undefined }
  ) {
    if (node?._task) node._task.closed = ['trigger']
    console.log('********* processing input to ethereum input *********')
    console.log(data)

    // Handle data subscription. If there is data, this is from playtest
    if (data && !isEmpty(data)) {
      if (node?._task) node._task.closed = []

      return {
        output: data,
      }
    }
  }
}
