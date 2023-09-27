// DOCUMENTED
/**
 * The lodash isEmpty function checks if the input variable is an empty object, collection, map, or set.
 * More information: https://lodash.com/docs/4.17.15#isEmpty
 */
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

// A string variable that describes the component’s functionality.
const info = `Check the recent transactions of an Ethereum wallet`

// A custom return type related to the class GetRecentTxsFromWallet.
type InputReturn =
  | {
      output: string
    }
  | undefined

/**
 * GetRecentTxsFromWallet is a custom component that returns the recent transactions of a specified wallet address.
 * It belongs to the Ethereum family according to the specification in the constructor.
 *
 * @remarks
 * This component extends the MagickComponent class from the @magickml/core module and has an async worker method.
 *
 * @returns a promise with a custom InputReturn type
 */
export class GetRecentTxsFromWallet extends MagickComponent<
  Promise<InputReturn>
> {
  // constructor with the initialization of the name, output(s), and context menu of the component.
  constructor() {
    super(
      'Get Recent Transactions',
      {
        outputs: {
          // custom output which is a string on this context.
          output: 'output',
          // definitions of the trigger that can activate the component.
          trigger: 'option',
        },
      },
      'Ethereum',
      info
    )

    // module property definition, it has a nodetype and a socket.
    this.module = {
      nodeType: 'triggerIn',
      socket: anySocket,
    }

    // context menu and display name configuration.
    this.contextMenuName = 'Get Recent Transactions'
    this.displayName = 'Get Recent Transactions'
  }

  // custom builder method that returns the created inputs and outputs of the node.
  builder(node: MagickNode) {
    const addressInput = new Rete.Input(
      'address',
      'Wallet Address',
      numberSocket
    )
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const balanceOutput = new Rete.Output('output', 'Output', stringSocket)

    // module components require the definition of a socket key.
    node.data.socketKey = node?.data?.socketKey || uuidv4()

    // return of the node adding all inputs and outputs.
    return node
      .addInput(dataInput)
      .addInput(addressInput)
      .addOutput(dataOutput)
      .addOutput(balanceOutput)
  }

  /**
   * The worker method is responsible for defining the actual functionality of the component.
   *
   * @remarks
   * As shown before, the component expects a custom return of the InputReturn type.
   *
   * @param node - Required by the worker and uses the WorkerData type from the @magickml/core module.
   * @param inputs - Required by the worker and uses the MagickWorkerInputs type from the @magickml/core module.
   * @param outputs - Required by the worker and uses the MagickWorkerOutputs type from the @magickml/core module.
   * @param data - A property of the worker method which defines the wallet address.
   *
   * @returns a promise with a custom InputReturn type
   */
  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    outputs: MagickWorkerOutputs,
    { data }: { data: string | undefined }
  ): Promise<InputReturn> {
    // The closed attribute of the _task property prevents workflow execution until its 'trigger' attribute is set.
    if (node?._task) node._task.closed = ['trigger']

    // This block of code checks whether data exists and is not empty. If there is any data, it gets returned.
    if (data && !isEmpty(data)) {
      if (node?._task) node._task.closed = []
      return {
        output: data,
      }
    }
  }
}
