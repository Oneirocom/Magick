// DOCUMENTED
import Rete from 'shared/rete'
import { InputControl } from '../../dataControls/InputControl'
import { MagickComponent } from '../../engine'
import { arraySocket, stringSocket } from '../../sockets'
import { MagickNode, MagickWorkerInputs, WorkerData } from '../../types'

const info = `Takes an input array and will join each item in the array into a single output string. The optional Separator property will separate each item in the array by the specified character or string.`

type WorkerReturn = {
  text: string
}

/** The Join List component takes in an array of items and joins them together with a separator specified in the input field. */
export class JoinListComponent extends MagickComponent<WorkerReturn> {
  /**
   * JoinListComponent constructor with preset options
   */
  constructor() {
    super(
      'Join List', // Component name
      {
        outputs: {
          text: 'output',
          trigger: 'option',
        },
      },
      'Data/Arrays',
      info
    )
  }

  /**
   * Builder function to assemble the node component.
   * @param {MagickNode} node - The node to build.
   * @returns {MagickNode} - The built node.
   */
  builder(node: MagickNode) {
    // Create inputs
    const inputList = new Rete.Input('list', 'List', arraySocket)

    const out = new Rete.Output('text', 'String', stringSocket)

    // Handle default value if data is present
    const separator = node.data.separator
      ? (node.data.separator as string)
      : ' '

    // Controls are the internals of the node itself
    const input = new InputControl({
      name: 'Separator',
      dataKey: 'separator',
      defaultValue: separator,
      tooltip: 'this is a separator input ',
    })
    node.inspector.add(input)

    return node.addOutput(out).addInput(inputList)
  }

  /**
   * Worker function contains the main business logic of the node.
   * It passes those results to the outputs to be consumed by connected components.
   * @param {WorkerData} node - The node data
   * @param {MagickWorkerInputs & { list: [string][] }} inputs - The worker inputs
   * @returns {WorkerReturn} - The worker return object
   */
  worker(
    node: WorkerData,
    inputs: MagickWorkerInputs & { list: [string][] }
  ): WorkerReturn {
    return {
      text: inputs.list[0].join(node.data.separator as string),
    }
  }
}
