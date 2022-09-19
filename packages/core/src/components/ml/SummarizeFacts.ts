process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios'
import Rete from 'rete'

import {
  EngineContext,
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../types'
import { FewshotControl } from '../../dataControls/FewshotControl'
import { triggerSocket, stringSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info = 'Summarize And Store Facts About Agent'

const fewshot = ``

type InputReturn = {
  output: unknown
}

export class SummarizeFacts extends ThothComponent<Promise<InputReturn>> {
  constructor() {
    super('Summarize Facts')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }

    this.category = 'Agents'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    if (!node.data.fewshot) node.data.fewshot = fewshot

    const inp = new Rete.Input('string', 'Input', stringSocket)
    const factsOut = new Rete.Output('output', 'Facts', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    const fewshotControl = new FewshotControl({})

    node.inspector.add(fewshotControl)

    return node
      .addInput(inp)
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(factsOut)
  }

  async worker(
    node: NodeData,
    _inputs: ThothWorkerInputs,
    _outputs: ThothWorkerOutputs,
    { silent }: { silent: boolean }
  ) {
    const prompt = node.data.fewshot as string

    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/hf_request`,
      {
        inputs: prompt,
        model: 'toloka/t5-large-for-text-aggregation',
      }
    )

    const result = await response.data

    console.log('result is', result)

    if (!silent) node.display(result)

    return {
      output: result,
    }
  }
}
