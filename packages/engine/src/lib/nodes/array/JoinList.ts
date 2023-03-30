// GENERATED 
/**
 * This component takes in an array, and will join each item in the array together with a separator defined in the component's input field.
 *
 * @remarks
 * It extends the `MagickComponent` class and has one output type: 'text' of type 'String'.
 *
 * @example
 * typescript
 * const joinList = new JoinListComponent();
 * 
 */
import Rete from 'rete';
import { InputControl } from '../../dataControls/InputControl';
import { MagickComponent } from '../../engine';
import { arraySocket, stringSocket } from '../../sockets';
import { MagickNode, MagickWorkerInputs, WorkerData } from '../../types';

// Info about the component
const info = `This component takes in an array, and will join each item in the array together with a separator defined in the component's input field.`;

// The return type of the worker function
type WorkerReturn = {
  text: string;
};

export class JoinListComponent extends MagickComponent<WorkerReturn> {
  constructor() {
    // Call the constructor of the base class with the component name, output types and info
    super('Join List', { outputs: { text: 'output', trigger: 'option' } }, 'Array', info);
  }

  /**
   * Builds the node component. Creates the inputs and controls for the component.
   * @param node - the node instance to build on
   * @returns the node with the input and output
   */
  builder(node: MagickNode): MagickNode {
    // Add the inputs and outputs to the node
    const inputList = new Rete.Input('list', 'List', arraySocket);
    const output = new Rete.Output('text', 'String', stringSocket);

    // Handle default value if data is present
    const separator = node.data.separator ? node.data.separator as string : ' ';

    // Create and add the text input field control
    const input = new InputControl({
      name: 'Separator',
      dataKey: 'separator',
      defaultValue: separator,
    });
    node.inspector.add(input);

    return node.addOutput(output).addInput(inputList);
  }

  /**
   * The worker that contains the main business logic of the component. Takes in the inputs,
   * performs the necessary calculations and returns the result with the output.
   * @param node - the node for which to perform the worker function
   * @param inputs - the inputs for the worker
   * @returns the output of the worker as {text: string}
   */
  worker(node: WorkerData, inputs: MagickWorkerInputs & { list: [string][] }): WorkerReturn {
    return {
      text: inputs.list[0].join(node.data.separator as string),
    };
  }
}
