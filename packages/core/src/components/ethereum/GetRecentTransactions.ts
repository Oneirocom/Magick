/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as ethers from 'ethers'
import Rete from 'rete'

const etherscanProvider = new ethers.providers.EtherscanProvider()

import {
  EngineContext,
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../../types'
import { triggerSocket, numSocket, stringSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info = 'Check the recent transactions of an ethereum wallet'

export class GetRecentTransactions extends ThothComponent<void> {
  constructor() {
    super('Get Recent Transactions')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }

    this.category = 'Ethereum'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    const addressInput = new Rete.Input('address', 'Wallet Address', numSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const balanceOutput = new Rete.Output('output', 'Output', stringSocket)

    return node
      .addInput(addressInput)
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(balanceOutput)
  }

  async worker(node: NodeData, inputs: ThothWorkerInputs) {
    const address = inputs['address'][0] as unknown as string
    node.display(address)

    const getRecentTransactionsForWallet = async walletAddress => {
      const transactions = await etherscanProvider.getHistory(walletAddress)
      return transactions
    }

    const output = await getRecentTransactionsForWallet(address)

    return {
      output,
    }
  }
}
