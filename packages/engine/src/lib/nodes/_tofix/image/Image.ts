/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios'
import Rete from 'rete'
import { API_ROOT_URL } from '../../../config'
import { BooleanControl } from '../../../dataControls/BooleanControl'
import { InputControl } from '../../../dataControls/InputControl'
import { MagickComponent } from '../../../engine'
import { anySocket } from '../../../sockets'
import {
  MagickNode, WorkerData
} from '../../../types'

const info = `Image Variable`

type InputReturn = {
  output: string | Image
}

export class Image extends MagickComponent<Promise<InputReturn>> {
  static Image_Val
  id_image: unknown
  constructor() {
    super('Image Variable', {
      outputs: {
        output: 'output',
      },
    }, 'Image', info)

    this.display = true
  }

  builder(node: MagickNode) {
    const out = new Rete.Output('output', 'output', anySocket)
    const _var = new InputControl({
      dataKey: '_var',
      name: 'Value',
      icon: 'moon',
    })
    const name = new InputControl({
      dataKey: 'name',
      name: 'Name',
      icon: 'moon',
    })

    const _public = new BooleanControl({
      dataKey: 'isPublic',
      name: 'isPublic',
    })

    node.inspector.add(name).add(_var).add(_public).add_img(node.id.toString())

    return node.addOutput(out)
  }

  async worker(node: WorkerData) {
    const _var = node?.data?._var as string
    const params = new URLSearchParams([['id', node.id.toString()]]);
    const result = await axios.get<Image|string>(`${API_ROOT_URL}/upload`, { params });
    return {
      output: result ? (result.data) : '',
    }
  }
}

