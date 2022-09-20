process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios'
import Rete from 'rete'

import {
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../types'
import { FewshotControl } from '../../dataControls/FewshotControl'
import { stringSocket, triggerSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'
// For simplicity quests should be ONE thing not complete X and Y
const fewshot = `Given an action, detect the item which is taken.
Action, Item: pick up the goblet from the fountain, goblet
Action, Item: grab the axe from the tree stump, axe
Action, Item: lean down and grab the spear from the ground, spear
Action, Item: gather the valerian plant from the forest, valerian plant
Action, Item: get the necklace from the box, necklace
Action, Item: `

const info = `The item detector attempts to recognize what item in a give text string is being mentioned or used.  The input is a text string the output is a string of the object`

type WorkerReturn = {
  detectedItem: string
}

export class ItemTypeComponent extends ThothComponent<Promise<WorkerReturn>> {
  constructor() {
    // Name of the component
    super('Item Detector')

    this.task = {
      outputs: { detectedItem: 'output', trigger: 'option' },
    }

    this.category = 'AI/ML'
    this.display = true
    this.info = info
    this.deprecated = true
    this.deprecationMessage =
      'This component has been deprecated. You can get similar functionality by using a generator with your own fewshots.'
  }

  builder(node: ThothNode) {
    if (!node.data.fewshot) node.data.fewshot = fewshot
    const inp = new Rete.Input('string', 'Text', stringSocket)
    const out = new Rete.Output('detectedItem', 'Item Detected', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    const fewshotControl = new FewshotControl({})

    node.inspector.add(fewshotControl)

    return node
      .addInput(inp)
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(out)
  }

  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    _outputs: ThothWorkerOutputs,
    { silent }: { silent: boolean }
  ) {
    const action = inputs['string'][0]
    const fewshot = node.data.fewshot as string
    const prompt = fewshot + action + ','

    const resp = await axios.post(
      `${
        process.env.REACT_APP_API_URL ??
        process.env.API_URL ??
        'https://localhost:8001'
      }/text_completion`,
      {
        params: {
          prompt: prompt,
          modelName: 'davinci',
          temperature: 0.0,
          maxTokens: 100,
          stop: ['\n'],
        },
      }
    )

    const { success, choice } = resp.data

    const result = success ? choice?.trim() : ''
    if (!silent) node.display(result)

    return {
      detectedItem: result,
    }
  }
}
