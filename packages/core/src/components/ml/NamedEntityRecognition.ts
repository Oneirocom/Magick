process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios'
import Rete from 'rete'

import { NodeData, ThothNode, ThothWorkerInputs } from '../../types'
import { triggerSocket, anySocket, stringSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info =
  'Named Entity Recognition returns the type of the object the input string is talking about.'

type WorkerReturn = {
  output: any
}

export class NamedEntityRecognition extends ThothComponent<
  Promise<WorkerReturn>
> {
  constructor() {
    super('Named Entity Recognition')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }

    this.category = 'AI/ML'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    const input = new Rete.Input('string', 'String', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const output = new Rete.Output('output', 'Output', anySocket)

    return node
      .addInput(input)
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(output)
  }

  async worker(_node: NodeData, inputs: ThothWorkerInputs) {
    const action = inputs['string'][0] as string

    const resp = await axios.post(
      `${process.env.REACT_APP_API_URL}/hf_request`,
      {
        inputs: action,
        model: 'dslim/bert-large-NER',
        parameters: [],
        options: undefined,
      }
    )

    const { success, data } = resp.data
    let type = 'No Type Found'

    if (success) {
      if (data && data.length > 0) {
        if (data[0].entity_group === 'PER') {
          type = 'Alive Object'
        } else {
          type = 'Location'
        }
      } else {
        type = 'Not Alive Object'
      }
    }

    return {
      output: type,
    }
  }
}
