// GENERATED 
/**
 * Represents the Image class which extends the MagickComponent class.
 */
import axios from 'axios';
import Rete from 'rete';
import { API_ROOT_URL } from '../../../config';
import { BooleanControl } from '../../../dataControls/BooleanControl';
import { InputControl } from '../../../dataControls/InputControl';
import { MagickComponent } from '../../../engine';
import { anySocket } from '../../../sockets';
import { ImageType, MagickNode, WorkerData } from '../../../types';

/**
 * The information about the class.
 */
const info = `Image Variable`;

/**
 * The variable and its definition.
 */
type InputReturn = {
  output: string | ImageType;
}

/**
 * Represents the Image class which extends the MagickComponent class.
 */
export class Image extends MagickComponent<Promise<InputReturn>> {
  id_image: string | null;
  /**
   * Constructor which sets the initial value of the variables.
   */
  constructor() {
    super('Image Variable', {
      outputs: {
        output: 'output',
      },
    }, 'Image', info);

    this.id_image = null;
  }

  /**
   * Builder function which is used to define inputs and outputs for the node.
   * @param node Rete node.
   * @returns node with input and output.
   */
  builder(node: MagickNode) {

    const out = new Rete.Output('output', 'output', anySocket);

    const _var = new InputControl({
      dataKey: '_var',
      name: 'Value',
      icon: 'moon',
    });

    const name = new InputControl({
      dataKey: 'name',
      name: 'Name',
      icon: 'moon',
    });

    const _public = new BooleanControl({
      dataKey: 'isPublic',
      name: 'isPublic',
    });

    node.inspector.add(name).add(_var).add(_public).add_img(node.id.toString());
    
    return node.addOutput(out);
  }

  /**
   * Worker function which is used to generate the output for the node based on input.
   * @param node Rete node.
   * @returns value of output.
   */
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async worker(node: WorkerData) {

    const _var = node?.data?._var as string;

    const params = new URLSearchParams([['id', node.id.toString()]]);
    
    const result = await axios.get<Image|string>(`${API_ROOT_URL}/upload`, { params });

    return {
      output: result ? (result.data) : '',
    }
  }
}