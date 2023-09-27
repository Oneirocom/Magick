// DOCUMENTED
import { isEmpty } from 'lodash'
import Rete from 'shared/rete'
import { v4 as uuidv4 } from 'uuid'

import {
  anySocket,
  MagickComponent,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  numberSocket,
  stringSocket,
  triggerSocket,
  WorkerData,
} from 'shared/core'

/**
 * Check the recent transactions from another wallet
 */
const info = `Check the recent transactions from another wallet`

/**
 * InputReturn type
 */
type InputReturn =
  | {
      output: string
    }
  | undefined

/**
 * Class that checks for recent transactions from a wallet
 * @extends {MagickComponent<Promise<InputReturn>>}
 */
export class CheckForRecentTxFromWallet extends MagickComponent<
  Promise<InputReturn>
> {
  /**
   * Constructor for CheckForRecentTxFromWallet
   */
  constructor() {
    // Name of the component
    super(
      'Check For Recent Transactions',
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

    this.contextMenuName = 'Check For Recent Transactions'
    this.displayName = 'Check For Recent Transactions'
  }

  /**
   * Set up the node builder for the component
   * @param {MagickNode} node - The Rete.js node
   * @returns {MagickNode} - The modified node with the required inputs and outputs
   */
  builder(node: MagickNode): MagickNode {
    // module components need to have a socket key.
    // todo add this somewhere automated? Maybe wrap the modules builder in the plugin
    node.data.socketKey = node?.data?.socketKey || uuidv4()

    const addressInput = new Rete.Input(
      'address',
      'Wallet Address',
      numberSocket
    )
    const senderInput = new Rete.Input('sender', 'Sender Address', numberSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const balanceOutput = new Rete.Output('output', 'Output', stringSocket)

    return node
      .addInput(dataInput)
      .addInput(addressInput)
      .addInput(senderInput)
      .addOutput(dataOutput)
      .addOutput(balanceOutput)
  }

  /**
   * Worker function that handles data processing for the component
   * @param {WorkerData} node - The Rete.js node data
   * @param {MagickWorkerInputs} _inputs - The worker inputs
   * @param {MagickWorkerOutputs} outputs - The worker outputs
   * @param {{ data: string | undefined }} { data } - Additional options or data, including the data string
   * @returns {Promise<InputReturn>} - A Promise with the processed input return data or undefined
   */
  async worker(
    node: WorkerData,
    _inputs: MagickWorkerInputs,
    outputs: MagickWorkerOutputs,
    { data }: { data: string | undefined }
  ): Promise<InputReturn> {
    if (node?._task) node._task.closed = ['trigger']

    // handle data subscription.  If there is data, this is from playtest
    if (data && !isEmpty(data)) {
      if (node?._task) node._task.closed = []

      return {
        output: data,
      }
    }
  }
}
