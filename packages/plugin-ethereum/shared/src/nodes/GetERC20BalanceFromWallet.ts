import { isEmpty } from 'lodash'
import Rete from 'rete'
import { v4 as uuidv4 } from 'uuid'

import {
  anySocket,
  MagickComponent,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  NodeData,
  numberSocket,
  stringSocket,
  triggerSocket,
} from '@magickml/engine'

const info = `Check the balance of an ethereum wallet for an ERC20 at a contract address`

type InputReturn = {
  output: unknown
}

export class GetERC20BalanceFromWallet extends MagickComponent<InputReturn> {
  constructor() {
    // Name of the component
<<<<<<< refs/remotes/origin/development:packages/plugin-ethereum/shared/src/nodes/CheckBalanceForERC20.ts
    super('Check ERC20 Balance')
=======
    super('PluginEthGetERC20BalanceFromWallet')
>>>>>>> plugin(eth): change node's names and display names:packages/plugin-ethereum/shared/src/nodes/GetERC20BalanceFromWallet.ts

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
    this.contextMenuName = 'Check ERC20 Balance'
    this.displayName = 'Check ERC20 Balance'
  }

  destroyed(node: MagickNode) {
    console.log('destroyed', node.id)
  }

  builder(node: MagickNode) {
    // module components need to have a socket key.
    // todo add this somewhere automated? Maybe wrap the modules builder in the plugin
    node.data.socketKey = node?.data?.socketKey || uuidv4()

    const addressInput = new Rete.Input('address', 'Wallet Address', numberSocket)
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
