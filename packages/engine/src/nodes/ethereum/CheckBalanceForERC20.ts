/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as ethers from 'ethers'
import Rete from 'rete'

const provider = new ethers.providers.JsonRpcProvider(
  'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
)

import { NodeData, MagickNode, MagickWorkerInputs } from '../../types'
import { triggerSocket, numSocket, stringSocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'

const info =
  'Check the balance of an ethereum wallet for an ERC20 at a contract address'

export class CheckBalanceForERC20 extends MagickComponent<void> {
  constructor() {
    super('Check Balance for ERC20')

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
    const contractAddressInput = new Rete.Input(
      'contract',
      'Contract Address',
      numSocket
    )
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const balanceOutput = new Rete.Output('output', 'Output', stringSocket)

    return node
      .addInput(addressInput)
      .addInput(contractAddressInput)
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(balanceOutput)
  }

  async worker(node: NodeData, inputs: MagickWorkerInputs) {
    const address = inputs['address'][0] as unknown as string
    const contractAddress = inputs['contract'][0] as unknown as string
    node.display(address)

    const checkBalanceForERC20 = async (walletAddress, contractAddress) => {
      const erc20Abi = [
        // Some details about the token
        'function name() view returns (string)',
        'function symbol() view returns (string)',
        'function decimals() view returns (uint8)',
        // Get the account balance
        'function balanceOf(address) view returns (uint)',

        // Send some of your tokens to someone else
        'function transfer(address to, uint amount)',
      ]
      const contract = new ethers.Contract(contractAddress, erc20Abi, provider)
      const balance = await contract.balanceOf(walletAddress)
      // convert big number to int
      return parseInt(balance.toString())
    }

    const output = await checkBalanceForERC20(address, contractAddress)

    return {
      output,
    }
  }
}
