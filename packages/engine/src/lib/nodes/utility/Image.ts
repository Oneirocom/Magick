/* eslint-disable @typescript-eslint/no-unused-vars */
import Rete from 'rete'
import axios from 'axios'
import {
  NodeData,
  MagickNode,
} from '../../types'
import { API_ROOT_URL } from '../../config'
import { InputControl } from '../../dataControls/InputControl'
import { anySocket, stringSocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'
import { BooleanControl } from '../../dataControls/BooleanControl'

const info = `Image Variable`

type InputReturn = {
  output: string
}

export class Image extends MagickComponent<any> {
  static Image_Val
  id_image: any
  constructor() {
    super('Image Variable')

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
      dataKey: 'Public',
      name: 'Public',
    })

    node.inspector.add(name).add(_var).add(_public).add_img(node.id.toString())

    return node.addOutput(out)
  }

  async worker(node: NodeData) {
    const _var = node?.data?._var as string
    const params = new URLSearchParams([['id', node.id]]);
    const result = await axios.get(`${API_ROOT_URL}/DiscordPlugin`, { params });
    return {
      output: result ? (result.data as any) : '',
    }
  }
}

