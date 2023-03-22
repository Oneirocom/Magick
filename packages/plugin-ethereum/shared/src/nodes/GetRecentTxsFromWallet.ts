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
  numberSocket,
  stringSocket,
  triggerSocket,
} from '@magickml/engine'

const info = `Check the recent transactions of an ethereum wallet`

type InputReturn = {
  output: unknown
}

export class GetRecentTxsFromWallet extends MagickComponent<InputReturn> {
  constructor() {
    // Name of the component
<<<<<<< refs/remotes/origin/development:packages/plugin-ethereum/shared/src/nodes/GetRecentTransactions.ts
    super('Get Recent Transactions')
=======
    super('PluginEthGetRecentTxsFromWallet')
>>>>>>> plugin(eth): change node's names and display names:packages/plugin-ethereum/shared/src/nodes/GetRecentTxsFromWallet.ts

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
    this.contextMenuName = 'Get Recent Transactions'
    this.displayName = 'Get Recent Transactions'
  }

  builder(node: MagickNode) {
    const addressInput = new Rete.Input('address', 'Wallet Address', numberSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const balanceOutput = new Rete.Output('output', 'Output', stringSocket)

    // module components need to have a socket key.
    // todo add this somewhere automated? Maybe wrap the modules builder in the plugin
    node.data.socketKey = node?.data?.socketKey || uuidv4()

    return node
      .addInput(dataInput)
      .addInput(addressInput)
      .addOutput(dataOutput)
      .addOutput(balanceOutput)
  }

  // @ts-ignore
  async worker(
    node: NodeData,
    _inputs: MagickWorkerInputs,
    outputs: MagickWorkerOutputs,
    { data }: { data: string | undefined }
  ) {
    this._task.closed = ['trigger']

    // handle data subscription.  If there is data, this is from playtest
    if (data && !isEmpty(data)) {
      this._task.closed = []

<<<<<<< refs/remotes/origin/development
=======

>>>>>>> remove display
      return {
        output: data,
      }
    }
  }
}
