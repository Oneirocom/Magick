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
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
} from '../../types'
import { triggerSocket, numSocket, stringSocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'

const info = 'Check the recent transactions from another wallet'

export class CheckForRecentTransactionsFromWallet extends MagickComponent<void> {
  constructor() {
    super('Check For Recent Transaction From Wallet')

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

  builder(node: MagickNode) {
    const addressInput = new Rete.Input('address', 'Wallet Address', numSocket)
    const senderInput = new Rete.Input('sender', 'Sender Address', numSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const balanceOutput = new Rete.Output('output', 'Output', stringSocket)

    return node
      .addInput(addressInput)
      .addInput(senderInput)
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(balanceOutput)
  }

  async worker(
    node: NodeData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    { silent }: { silent: boolean }
  ) {
    const address = inputs['address'][0] as unknown as string
    const sender = inputs['sender'][0] as unknown as string
    if (!silent) node.display(address)

    const checkForRecentTransactionFromWalletToWallet = async (
      walletAddress,
      walletAddress2
    ) => {
      // check if there is a recent transaction from walletAddress to walletAddress2
      // if there is, return the transaction
      // if there is not, return null
      const transactions = await etherscanProvider.getHistory(walletAddress)
      for (let i = 0; i < transactions.length; i++) {
        if (transactions[i].to === walletAddress2) {
          return transactions[i]
        }
      }
      return null
    }

    const output = await checkForRecentTransactionFromWalletToWallet(
      address,
      sender
    )

    return {
      output,
    }
  }
}
