// GENERATED 
// Import necessary modules
import Rete from 'rete'
import {
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
} from '../../types'
import { NumberControl } from '../../dataControls/NumberControl'
import { triggerSocket } from '../../sockets'
import { MagickComponent, MagickTask } from '../../types'


// Information about the component
const info = `While loop is used to execute a series of tasks for x times`;

/**
 * @typedef WorkerReturn
 * @property {number} [element]
 */
type WorkerReturn = {
  element?: number;
};

/**
 * WhileLoop class that extends MagickComponent
 * @class
 * @augments MagickComponent<Promise<WorkerReturn | undefined>>
 */
export class WhileLoop extends MagickComponent<Promise<WorkerReturn | undefined>> {
  /**
   * Constructor for the WhileLoop component class
   */
  constructor() {
    super('While Loop');
    this.task = {
      outputs: { true: 'option', element: 'output', false: 'option' },
    };
    this.category = 'Flow';
    this.info = info;
  }

  /**
   * Builder function to build the node
   * @param {MagickNode} node - Magick node for the component
   * @returns {MagickNode} - Built node
   */
  builder(node: MagickNode): MagickNode {
    const inp = new Rete.Input('act1', 'Data', triggerSocket, true);
    const isTrue = new Rete.Output('true', 'Done', triggerSocket);
    const isFalse = new Rete.Output('false', 'Loop', triggerSocket);

    const recursionTimes = new NumberControl({
      dataKey: 'recursionTimes',
      name: 'Recursion Times',
      icon: 'moon',
    });

    node.inspector.add(recursionTimes);

    return node.addInput(inp).addOutput(isTrue).addOutput(isFalse);
  }

  /**
   * Worker function for thread handling
   * @param {NodeData} node - Node data
   * @param {MagickWorkerInputs} _inputs - Worker inputs
   * @param {MagickWorkerOutputs} _outputs - Worker outputs
   * @param {{element: number}} param4 - Element property wrapper
   * @returns {Promise<WorkerReturn | undefined>} - Promise for worker return value
   */
  async worker(
    node: NodeData,
    _inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    { element }: { element: number },
  ): Promise<WorkerReturn | undefined> {
    const recursionTimesData = node?.data?.recursionTimes as string;
    const recursionTimes = recursionTimesData ? parseInt(recursionTimesData) : 0;
    const array: number[] = [];
    
    for (let i = 0; i < recursionTimes - (element ?? 0); i++) {
      array.push(i + 1);
    }

    if (element === undefined) {
      await Promise.all(
        array.map((el: number) => {
          if (el >= 2) {
            return;
          }
          this._task
            .clone(false, {} as MagickTask, {} as MagickTask)
            .run({ element: element !== undefined ? element + 1 : 1 });
        }),
      );
    
      this._task.closed = ['false'];
      return {};
    } else {
      this._task.closed = ['true'];
      return { element };
    }
  }
}