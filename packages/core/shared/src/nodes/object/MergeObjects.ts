// DOCUMENTED 
import Rete from 'rete';

import { InputControl } from '../../dataControls/InputControl';
import { SocketGeneratorControl } from '../../dataControls/SocketGenerator';
import { MagickComponent } from '../../engine';
import { objectSocket, triggerSocket } from '../../sockets';
import {
  MagickNode,
  MagickWorkerInputs, WorkerData
} from '../../types';

/**
 * Info text for the Merge Component
 */
const info = `Merge can take in any number of properties in the form of named sockets, and compose them together into an object. Additionally, another object can be added in, in which case merge will add in any properties from that object, but overwrite them with any from the sockets.`;

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
      'Object',
      info
    );
  }

  /**
   * Sets up the node with inputs and outputs for merging
   * @param {MagickNode} node - The MagickNode to build for the Merge Component
   * @returns {MagickNode} - The built MagickNode
   */
  builder(node: MagickNode): MagickNode {
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true);
    const objectInput = new Rete.Input(
      'object',
      'Object (optional)',
      objectSocket
    );
    const outputTrigger = new Rete.Output('trigger', 'Trigger', triggerSocket);
    const objectOutput = new Rete.Output('object', 'Object', objectSocket);

    const nameInput = new InputControl({
      dataKey: 'name',
      name: 'Node name',
    });

    const socketGenerator = new SocketGeneratorControl({
      connectionType: 'input',
      ignored: ['trigger', 'object'],
      name: 'Property Name',
    });

    node
      .addInput(dataInput)
      .addInput(objectInput)
      .addOutput(outputTrigger)
      .addOutput(objectOutput);

    node.inspector.add(nameInput).add(socketGenerator);

    return node;
  }

  /**
   * Combines the input object and named sockets into a new object
   * @param {WorkerData} _node - The WorkerData (unused)
   * @param {MagickWorkerInputs} inputs - Input data to merge
   * @returns {{ object: Record<string, unknown> }} - The merged object
   */
  worker(_node: WorkerData, inputs: MagickWorkerInputs) {
    const object = inputs.object[0] as Record<string, unknown>;
    const combinedInputs = Object.entries(inputs).reduce(
      (acc, [key, value]) => {
        if (key === 'object') return acc;
        acc[key] = value[0];
        return acc;
      },
      {} as Record<string, unknown>
    );

    const combined = {
      ...object,
      ...combinedInputs,
    };

    return {
      object: combined,
    };
  }
}