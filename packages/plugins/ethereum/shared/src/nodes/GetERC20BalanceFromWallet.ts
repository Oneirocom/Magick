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

const info = `Check the balance of an ethereum wallet for an ERC20 at a contract address`

type InputReturn =
  | {
      output: string
    }
  | undefined

/**
 * GetERC20BalanceFromWallet class to check ERC20 balance from wallet
 * @extends {MagickComponent<Promise<InputReturn>>}
 */
export class GetERC20BalanceFromWallet extends MagickComponent<
  Promise<InputReturn>
> {
  /**
   * Creates an instance of GetERC20BalanceFromWallet.
   */
  constructor() {
    // Name of the component
    super(
      'Check ERC20 Balance',
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

    this.contextMenuName = 'Check ERC20 Balance'
    this.displayName = 'Check ERC20 Balance'
  }

  /**
   * Called when the node instance is destroyed.
   * @param {MagickNode} node
   */
  destroyed(node: MagickNode) {
    console.log('destroyed', node.id)
  }

  /**
   * Builds the node with inputs and outputs
   * @param {MagickNode} node
   */
  builder(node: MagickNode) {
    // module components need to have a socket key.
    // todo add this somewhere automated? Maybe wrap the modules builder in the plugin
    node.data.socketKey = node?.data?.socketKey || uuidv4()

    const addressInput = new Rete.Input(
      'address',
      'Wallet Address',
      numberSocket
    )
    const contractAddressInput = new Rete.Input(
      'contract',
      'Contract Address',
      numberSocket
    )
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const balanceOutput = new Rete.Output('output', 'Output', stringSocket)

    return node
      .addInput(dataInput)
      .addInput(addressInput)
      .addInput(contractAddressInput)
      .addOutput(dataOutput)
      .addOutput(balanceOutput)
  }

  /**
   * Async worker function. Processes inputs and returns outputs.
   * @param {WorkerData} node
   * @param {MagickWorkerInputs} _inputs
   * @param {MagickWorkerOutputs} outputs
   * @param {{ data: string | undefined }} options
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

    // handle data subscription.  If there is data, this is from playtest
    if (data && !isEmpty(data)) {
      if (node?._task) node._task.closed = []

      return {
        output: data,
      }
    }
  }
}
