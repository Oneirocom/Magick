/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as ethers from 'ethers'
import Rete from 'rete'

const provider = new ethers.providers.JsonRpcProvider(
  'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
)

import {
  EngineContext,
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
} from '../../../types'
import { triggerSocket, numSocket, stringSocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'

const info = 'Check the balance of an ethereum wallet'

export class CheckEthBalance extends MagickComponent<void> {
  constructor() {
    super('Check Balance')

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
    const addressInput = new Rete.Input('address', 'Address', numSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const balanceOutput = new Rete.Output('output', 'Output', stringSocket)

    return node
      .addInput(addressInput)
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(balanceOutput)
  }

  async worker(node: NodeData, inputs: MagickWorkerInputs) {
    const address = inputs['address'][0] as unknown as string
    node.display(address)

    const balance = await provider.getBalance(address)

    node.display(balance)

    const resultInEth = ethers.utils.formatEther(balance).toString()

    node.display(resultInEth)

    return {
      output: resultInEth,
    }
  }
}
