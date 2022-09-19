import Rete from 'rete'

import {
  EngineContext,
  ImageCacheResponse,
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../types'
import { InputControl } from '../../dataControls/InputControl'
import { triggerSocket, stringSocket, arraySocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info = `The VisualGeneration component is used to access the image cache. You pass it a caption and an optional topK value and it returns an array of images that are related to your caption. 

caption- is a string related to what type of image you want to search for.

topK- number of (k) matches for a particular description. IE: if you submit as a caption: "castle" and k was 5, it would return a fortress, a keep, a battlement, a gatehouse, and a tower. The k=5 images most similar to the word "castle`

export class VisualGeneration extends ThothComponent<
  Promise<ImageCacheResponse>
> {
  constructor() {
    super('VisualGeneration')
    this.task = {
      outputs: {
        images: 'output',
        trigger: 'option',
      },
    }
    this.category = 'AI/ML'
    this.info = info
  }

  builder(node: ThothNode) {
    const triggerIn = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const caption = new Rete.Input('caption', 'Caption', stringSocket)
    const triggerOut = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const imagesOut = new Rete.Output('images', 'Images', arraySocket)

    node
      .addInput(triggerIn)
      .addInput(caption)
      .addOutput(triggerOut)
      .addOutput(imagesOut)

    const topK = new InputControl({
      dataKey: 'topK',
      name: 'topK',
    })

    // const cacheTag = new InputControl({
    //   dataKey: 'cacheTag',
    //   name: 'Cache Tag',
    // })

    node.inspector.add(topK)

    return node
  }

  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    _outputs: ThothWorkerOutputs,
    { thoth }: { silent: boolean; thoth: EngineContext }
  ) {
    const { readFromImageCache } = thoth

    const caption = inputs.caption[0]
    if (!caption)
      throw new Error('Input Needed, Please provide a caption input')

    //Currently not using this yet
    const cacheTag = node.data.cacheTag ?? undefined

    try {
      const images = await readFromImageCache(
        caption as string,
        cacheTag as string,
        node.data.topK as number
      )

      return images
    } catch (err) {
      throw new Error('Error in VisualGeneration component')
    }
  }
}
