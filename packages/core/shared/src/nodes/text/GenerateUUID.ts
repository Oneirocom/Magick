// UNDOCUMENTED
/*
 * Rete UUID Generator Component
 * This component generates a UUID v4.
 */

import Rete from 'shared/rete'
import { v4 as uuidv4 } from 'uuid'
import { MagickComponent } from '../../engine'
import { stringSocket } from '../../sockets'
import { MagickNode, MagickWorkerInputs, WorkerData } from '../../types'

/**
 * Information about the UUID Generator component.
 */
const info =
  'Generates a UUID (Universally Unique Identifier) using version 4 algorithm and outputs it as a string.'

/**
 * Type for worker return data.
 */
type WorkerReturn = {
  output: string
}

/**
 * UUID Generator class.
 * This class represents the UUID Generator component in the Node Editor.
 * Includes builder and worker functions.
 */
export class UUIDGenerator extends MagickComponent<Promise<WorkerReturn>> {
  /**
   * UUID Generator constructor.
   * Initializes the component with its name and sockets.
   */
  constructor() {
    super(
      'UUID Generator',
      {
        outputs: {
          output: 'output',
        },
      },
      'Data/Text',
      info
    )
  }

  /**
   * Builder function for the component.
   * Sets up the UI and the inputs/outputs.
   * @param node {MagickNode} The node being built.
   */
  builder(node: MagickNode) {
    // Add sockets
    const outp = new Rete.Output('output', 'output', stringSocket)

    // Add input and output sockets to the node
    return node.addOutput(outp)
  }

  /**
   * Worker function for the component.
   * Generates the UUID.
   * @param node {WorkerData} The node data.
   * @param rawInputs {MagickWorkerInputs} The raw inputs to the component.
   */
  async worker(node: WorkerData, rawInputs: MagickWorkerInputs) {
    return {
      output: uuidv4(),
    }
  }
}
