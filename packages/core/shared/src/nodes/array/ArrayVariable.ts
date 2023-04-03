// DOCUMENTED 
import Rete from 'rete';
import { BooleanControl } from '../../dataControls/BooleanControl';
import { InputControl } from '../../dataControls/InputControl';
import { MagickComponent } from '../../engine';
import { arraySocket } from '../../sockets';
import { MagickNode, WorkerData } from '../../types';

/**
 * The info for the Array Variable node
 */
const info = `Array Variable`;

/**
 * Returns an object containing an output array of strings
 */
type InputReturn = {
  output: string[];
}

/**
 * A node that takes an input array and outputs a modified array
 */
export class ArrayVariable extends MagickComponent<InputReturn> {
  /**
   * Constructor for the ArrayVariable node
   */
  constructor() {
    super(
      'Array Variable',
      {
        outputs: {
          output: 'output',
        },
      },
      'Array',
      info,
    );
  }

  /**
   * Builds the node in the editor
   * @param node The node being built
   * @returns The node with inputs and outputs configured
   */
  builder(node: MagickNode) {
    const out = new Rete.Output('output', 'output', arraySocket);
    const name = new InputControl({
      dataKey: 'name',
      name: 'Name',
      icon: 'moon',
    });
    const _var = new InputControl({
      dataKey: '_var',
      name: 'Value',
      icon: 'moon',
    });
    const splitter = new InputControl({
      dataKey: 'splitter',
      name: 'Splitter',
      icon: 'moon',
    });
    const keepEmpty = new BooleanControl({
      dataKey: 'keepEmpty',
      name: 'Keep Empty Values',
      icon: 'moon',
    });
    node.inspector.add(name).add(_var).add(splitter).add(keepEmpty);
    return node.addOutput(out);
  }

  /**
   * Transforms an input array according to settings in the node
   * @param node The node being worked on
   * @returns An object containing the output array
   */
  worker(node: WorkerData) {
    const _var = node?.data?._var as string;
    const splitter = node?.data?.splitter as string;
    const keepEmpty = node?.data?.keepEmpty === 'true';
    const res = !keepEmpty ? _var.split(splitter).filter(el => el.length > 0) : _var.split(splitter);
    return {
      output: res,
    };
  }
}