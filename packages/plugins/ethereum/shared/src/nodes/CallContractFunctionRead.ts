// DOCUMENTED
import Rete from 'shared/rete'
import { v4 as uuidv4 } from 'uuid'
import {
  anySocket,
  InputControl,
  MagickComponent,
  MagickNode,
  MagickWorkerOutputs,
  stringSocket,
  triggerSocket,
} from '@magickml/core'

const info = `Call an arbitrary function from a contract`

type InputReturn =
  | {
      output: string | null
    }
  | undefined

/**
 * CallContractFunctionRead component
 *
 * Component to call an arbitrary read function from a contract.
 */
export class CallContractFunctionRead extends MagickComponent<
  Promise<InputReturn>
> {
  constructor() {
    // Name of the component
    super(
      'Contract Read',
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

    this.contextMenuName = 'Contract Read'
    this.displayName = 'Contract Read'
  }

  /**
   * Function to execute when the node is destroyed.
   *
   * @param node MagickNode object
   */
  destroyed(node: MagickNode) {
    console.log('destroyed', node.id)
  }

  /**
   * Builder function for the node
   *
   * @param node MagickNode object
   * @returns MagickNode object with input and output sockets
   */
  builder(node: MagickNode) {
    // module components need to have a socket key.
    // todo add this somewhere automated? Maybe wrap the modules builder in the plugin
    node.data.socketKey = node?.data?.socketKey || uuidv4()

    const contractInput = new Rete.Input('tx', 'Contract Addr', stringSocket)
    const functionInput = new Rete.Input('function', 'Func Name', stringSocket)
    const functionParamsInput = new Rete.Input(
      'functionParams',
      'Func Params',
      stringSocket
    )
    const abiInput = new Rete.Input('abi', 'ABI', anySocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const resultOutput = new Rete.Output('output', 'Output', stringSocket)

    const rpcHttpControl = new InputControl({
      dataKey: 'rpc_http',
      name: 'RPC Endpoint',
    })

    node.inspector.add(rpcHttpControl)

    return node
      .addInput(dataInput)
      .addInput(contractInput)
      .addInput(functionInput)
      .addInput(functionParamsInput)
      .addInput(abiInput)
      .addOutput(dataOutput)
      .addOutput(resultOutput)
  }

  /**
   * Worker function for the node, execute the read function from the contract.
   *
   * @param node WorkerData object
   * @param inputs MagickWorkerInputs object
   * @returns Promise resolving to MagickWorkerOutputs object containing the result
   */
  async worker(): Promise<MagickWorkerOutputs> {
    // const rpcHttp = node.data?.rpc_http as string;

    // const contractAddress = (inputs['tx'] && inputs['tx'][0]) as string;
    // const contractAbi = (inputs['abi'] && inputs['abi'][0]) as string;

    const res = null

    try {
      // TODO: call read with dynamic function name and params as client do with wagmi package
      // res = await contract?.myString();
    } catch {
      console.error('call reverted')
      return
    }

    return {
      output: res,
    }
  }
}
