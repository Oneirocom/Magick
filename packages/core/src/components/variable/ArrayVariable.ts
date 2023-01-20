import Rete from 'rete'

import {
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
} from '../../../types'
import { BooleanControl } from '../../dataControls/BooleanControl'
import { InputControl } from '../../dataControls/InputControl'
import { arraySocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'

const info = `Array Variable`

type InputReturn = {
  output: string[]
}

export class ArrayVariable extends MagickComponent<InputReturn> {
  constructor() {
    super('Array Variable')

    this.task = {
      outputs: {
        output: 'output',
      },
    }

    this.category = 'Variable'
    this.info = info
    this.display = true
  }

  builder(node: MagickNode) {
    const out = new Rete.Output('output', 'output', arraySocket)
    const _var = new InputControl({
      dataKey: '_var',
      name: 'Variable',
      icon: 'moon',
    })
    const splitter = new InputControl({
      dataKey: 'splitter',
      name: 'Splitter',
      icon: 'moon',
    })
    const name = new InputControl({
      dataKey: 'name',
      name: 'Name',
      icon: 'moon',
    })
    const keepEmpty = new BooleanControl({
      dataKey: 'keepEmpty',
      name: 'Variable',
      icon: 'moon',
    })

    node.inspector.add(name).add(_var).add(splitter).add(keepEmpty)

    return node.addOutput(out)
  }

  worker(node: NodeData) {
    //Validate inputs
    if (!node?.data?._var) {
      throw new Error('Variable is required');
    }
    if (!node?.data?.splitter) {
      throw new Error('Splitter is required');
    }
    if (!node?.data?.name) {
      throw new Error('Name is required');
    }

    // Extract inputs
    const _var = node.data._var as string;
    const splitter = node.data.splitter as string;
    const name = node.data.name as string;
    const keepEmpty = node.data.keepEmpty == 'true';

    // Perform split and filter
    const res = !keepEmpty
      ? _var.split(splitter).filter(el => el.length > 0)
      : _var.split(splitter);

    // set name and return output
    this.name = name + ' - ' + _var;
    return { output: res };
  }
}
