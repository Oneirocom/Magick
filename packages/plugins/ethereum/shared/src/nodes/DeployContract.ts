// DOCUMENTED
import { isEmpty } from 'lodash'
import Rete from 'shared/rete'
import { v4 as uuidv4 } from 'uuid'
import * as ethers from 'ethers'

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

const info = `Deploys a contract from Solidity code, a standard for defining non-fungible tokens on EVM machines.`

type InputReturn =
  | {
      output: string
    }
  | undefined

/**
 * Represents a DeployContract component for deploying a Solidity contract on EVM machines.
 * @extends {MagickComponent<Promise<InputReturn>>}
 */
export class DeployContract extends MagickComponent<Promise<InputReturn>> {
  /**
   * Creates a new DeployContract component.
   */
  constructor() {
    // Name of the component
    super(
      'Deploy Contract',
      {
        outputs: {
          trigger: 'option',
          balance_before: 'output',
          balance: 'output',
          tx: 'output',
          contract: 'output',
        },
      },
      'Ethereum',
      info
    )

    this.module = {
      nodeType: 'triggerIn',
      socket: anySocket,
    }

    this.contextMenuName = 'Deploy Contract'
    this.displayName = 'Deploy Contract'
  }

  /**
   * Builds the DeployContract node with its input and output sockets.
   * @param {MagickNode} node The node to add sockets and controls to.
   * @returns {MagickNode} The updated node with sockets and controls.
   */
  builder(node: MagickNode) {
    // module components need to have a socket key.
    // todo add this somewhere automated? Maybe wrap the modules builder in the plugin
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

    const bytecodeInput = new Rete.Input('bytecode', 'Bytecode', anySocket)
    const abiInput = new Rete.Input('abi', 'ABI', anySocket)
    const privatekeyInput = new Rete.Input(
      'privatekey',
      'Private Key',
      anySocket
    )
    const rpcHttpInput = new Rete.Input('rpc_http', 'RPC HTTP', stringSocket)
    const chainIdInput = new Rete.Input('chain_id', 'Chain ID', numberSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)

    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const balanceOutput = new Rete.Output(
      'balance_before',
      'Balance Before',
      numberSocket
    )
    const balanceAfterOutput = new Rete.Output(
      'balance',
      'Balance',
      numberSocket
    )
    const txOutput = new Rete.Output('tx', 'Transaction', stringSocket)
    const contractAddrOutput = new Rete.Output(
      'contract',
      'Contract Addr',
      stringSocket
    )

    return node
      .addInput(dataInput)
      .addInput(bytecodeInput)
      .addInput(abiInput)
      .addInput(rpcHttpInput)
      .addInput(chainIdInput)
      .addInput(privatekeyInput)
      .addOutput(dataOutput)
      .addOutput(balanceOutput)
      .addOutput(balanceAfterOutput)
      .addOutput(contractAddrOutput)
      .addOutput(txOutput)
  }

  /**
   * Performs the work of the DeployContract component.
   * @param {WorkerData} node The node data.
   * @param {MagickWorkerInputs} inputs The input data.
   * @param {MagickWorkerOutputs} _outputs The output data.
   * @param {{ data: string | undefined }} dataOption The data option.
   * @returns {Promise<InputReturn>} The result of the component's work.
   */
  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    { data }: { data: string | undefined }
  ) {
    if (node?._task) node._task.closed = ['trigger']

    const defaultNetwork = {
      name: 'maticmaticmum',
      chainId: 80001,
      _defaultProvider: providers =>
        new providers.JsonRpcProvider('https://rpc.ankr.com/polygon_mumbai'),
    }

    let chainId = defaultNetwork.chainId
    if (node.data?.chain_id) {
      const parsed = parseInt(node.data?.chain_id as string)
      if (!isNaN(parsed)) {
        chainId = parsed
      }
    }
    if (inputs['chain_id']) {
      const parsed = parseInt(inputs['chain_id'][0] as string)
      if (!isNaN(parsed)) {
        chainId = parsed
      }
    }

    let provider = ethers.getDefaultProvider(defaultNetwork)
    if (node.data?.rpc_http) {
      provider = new ethers.providers.JsonRpcProvider(
        node.data?.rpc_http as string,
        chainId
      )
    }
    if (inputs['rpc_http']) {
      provider = new ethers.providers.JsonRpcProvider(
        inputs['rpc_http'][0] as string,
        chainId
      )
    }

    const privateKey = (inputs['privatekey'] &&
      inputs['privatekey'][0]) as string
    const contractAbi = (inputs['abi'] && inputs['abi'][0]) as string
    const contractByteCode = (inputs['bytecode'] &&
      inputs['bytecode'][0]) as string

    // TODO: check if privateKey is valid
    const wallet = new ethers.Wallet(privateKey, provider)
    const factory = new ethers.ContractFactory(
      contractAbi,
      contractByteCode,
      wallet
    )

    const balanceBefore = await provider.getBalance(wallet.address)
    const balanceBeforeInEth = ethers.utils
      .formatEther(balanceBefore)
      .toString()

    const contract = await factory.deploy()
    await contract.deployTransaction.wait()

    const balance = await provider.getBalance(wallet.address)
    const balanceInEth = ethers.utils.formatEther(balance).toString()

    // handle data subscription.  If there is data, this is from playtest
    if (data && !isEmpty(data)) {
      if (node?._task) node._task.closed = []

      return {
        output: data,
        balance_before: balanceBeforeInEth,
        balance: balanceInEth,
        tx: contract.deployTransaction.hash,
        contract: contract.address,
      }
    }
  }
}
