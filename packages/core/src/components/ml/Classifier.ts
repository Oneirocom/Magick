import.meta.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

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
} from '../../../types'
import { InputControl } from '../../dataControls/InputControl'
import { stringSocket, triggerSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info =
  'Classifier takes an input string and arbitrary labels and returns the most likely label'

type InputReturn = {
  output: unknown
}

export class Classifier extends ThothComponent<Promise<InputReturn>> {
  constructor() {
    super('Classifier')

    this.task = {
      outputs: {
        trigger: 'option',
        output: 'output',
      },
    }

    this.category = 'AI/ML'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    const input = new Rete.Input('input', 'Input', stringSocket)

    const nameControl = new InputControl({
      dataKey: 'name',
      name: 'Component Name',
    })

    const labelControl = new InputControl({
      dataKey: 'labels',
      name: 'Labels',
    })

    node.inspector.add(nameControl).add(labelControl)
    const labelInput = new Rete.Input('labels', 'Labels', stringSocket, true)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const output = new Rete.Output('output', 'Output', stringSocket, true)

    return node
      .addOutput(output)
      .addOutput(dataOutput)
      .addInput(input)
      .addInput(labelInput)
      .addInput(dataInput)
  }

  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    _outputs: ThothWorkerOutputs,
    { silent }: { silent: boolean }
  ) {
    const inputData = inputs['input'][0]
    const labels = inputs['labels'] && inputs['labels'][0]
    const labelData = ((labels ?? node.data?.labels) as string).split(', ')

    const parameters = {
      candidate_labels: labelData,
    }

    const resp = await axios.post(
      `${
        import.meta.env.VITE_APP_API_URL ??
        import.meta.env.API_URL ??
        'https://0.0.0.0:8001'
      }/hf_request`,
      {
        inputs: inputData as string,
        model: 'facebook/bart-large-mnli',
        parameters: parameters,
        options: undefined,
      }
    )

    const { data, success, error } = resp.data

    if (!silent) {
      if (!success || !data) node.display(error)
      else node.display('Top label is ' + data && data.labels)
    }
    console.log('Respone is', resp.data)
    return { output: (data && data?.labels && data?.labels[0]) ?? 'error' }
  }
}
