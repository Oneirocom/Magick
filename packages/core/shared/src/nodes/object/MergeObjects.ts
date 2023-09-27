// DOCUMENTED
import Rete from 'shared/rete'

import { InputControl } from '../../dataControls/InputControl'
import { SocketGeneratorControl } from '../../dataControls/SocketGenerator'
import { MagickComponent } from '../../engine'
import { objectSocket, triggerSocket } from '../../sockets'
import { MagickNode, MagickWorkerInputs, WorkerData } from '../../types'

/**
 * Info text for the Merge Component
 */
const info = `Takes any number of variable inputs and composes a single output object using the input names as the property keys and the values passed into them. An optional object input can be passed in, which will add any properties and values from that object to the output but overwrite its values with any of the named socket inputs values with matching property names. For example if you pass in an object {"prop1": "val1", "prop2": "val2"}, then create a socket named "prop2" and pass in a value of "overwritten", and another named socket named "prop3" and pass in a value of "val3", your output object will look like {"prop1": "val1", "prop2": "overwritten", "prop3": "val3"}.`

/**
 * Merge class inherits from MagickComponent.
 * Creates a merged object from named sockets and an optional input object
 */
export class Merge extends MagickComponent<void> {
  constructor() {
    // Name of the component
    super(
      'Merge Objects',
      {
        outputs: {
          trigger: 'option',
          object: 'output',
        },
      },
      'Data/Object',
      info
    )
  }

  /**
   * Sets up the node with inputs and outputs for merging
   * @param {MagickNode} node - The MagickNode to build for the Merge Component
   * @returns {MagickNode} - The built MagickNode
   */
  builder(node: MagickNode): MagickNode {
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const objectInput = new Rete.Input(
      'object',
      'Object (optional)',
      objectSocket
    )
    const outputTrigger = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const objectOutput = new Rete.Output('object', 'Object', objectSocket)

    const nameInput = new InputControl({
      dataKey: 'name',
      name: 'Node name',
      tooltip: 'Enter node name',
    })

    const socketGenerator = new SocketGeneratorControl({
      connectionType: 'input',
      ignored: ['trigger', 'object'],
      name: 'Property Name',
      tooltip: 'Add property name',
    })

    node
      .addInput(dataInput)
      .addInput(objectInput)
      .addOutput(outputTrigger)
      .addOutput(objectOutput)

    node.inspector.add(nameInput).add(socketGenerator)

    return node
  }

  /**
   * Combines the input object and named sockets into a new object
   * @param {WorkerData} _node - The WorkerData (unused)
   * @param {MagickWorkerInputs} inputs - Input data to merge
   * @returns {{ object: Record<string, unknown> }} - The merged object
   */
  worker(_node: WorkerData, inputs: MagickWorkerInputs) {
    const object =
      inputs.object && (inputs.object[0] as Record<string, unknown>)
    const combinedInputs = Object.entries(inputs).reduce(
      (acc, [key, value]) => {
        if (key === 'object') return acc
        acc[key] = value[0]
        return acc
      },
      {} as Record<string, unknown>
    )

    const combined = {
      ...object,
      ...combinedInputs,
    }

    return {
      object: combined,
    }
  }
}
