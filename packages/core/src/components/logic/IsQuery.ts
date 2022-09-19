process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import axios from 'axios'
import Rete from 'rete'

import {
  EngineContext,
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../types'
import { triggerSocket, stringSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info =
  'Is Query node checks if an input is a query, that can be searched in the search corpus'

export class IsQuery extends ThothComponent<void> {
  constructor() {
    super('Is Query')

    this.task = {
      outputs: { true: 'option', false: 'option' },
    }

    this.category = 'Logic'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    const inp = new Rete.Input('input', 'Input', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const isTrue = new Rete.Output('true', 'True', triggerSocket)
    const isFalse = new Rete.Output('false', 'False', triggerSocket)

    return node
      .addInput(inp)
      .addInput(dataInput)
      .addOutput(isTrue)
      .addOutput(isFalse)
  }

  async worker() {
    // const str = inputs['input'][0]

    // let parameters = {
    //   candidate_labels: ['greeting', 'question', 'statement'],
    // }

    let is = false
    this._task.closed = is ? ['false'] : ['true']
    /*
    const resp = await axios.post(
      `${process.env.API_URL ?? 'https://localhost:8001'}/hf_request`,
      {
        inputs: str as string,
        model: 'facebook/bart-large-mnli',
        parameters: parameters,
        options: undefined,
      }
    )

    let data = resp.data.data
    let success = resp.data.success
    let error = resp.data.error

    if (!silent) {
      if (!success || !data) node.display(error)
      else node.display('Top label is ' + data && data.labels)
    }
    console.log('Respone is', resp.data)
    let highestScore = 0
    let highestLabel = ''

    if (data && data.labels?.length > 0) {
      for (let i = 0; i < data.labels.length; i++) {
        if (data.scores[i] > highestScore) {
          highestScore = data.scores[i]
          highestLabel = data.labels[i]
        }
      }

      is = highestLabel === 'question'
      console.log('highest label 1:', highestLabel, 'is:', is)

      if (is) {
        parameters = {
          candidate_labels: [
            'closed question',
            'loaded question',
            'funnel question',
            'data question',
            'rhetorical question',
            'general question',
            'speaker question',
            'information question',
          ],
        }

        const resp2 = await axios.post(
          `${process.env.API_URL ?? 'https://localhost:8001'}/hf_request`,
          {
            inputs: str as string,
            model: 'facebook/bart-large-mnli',
            parameters: parameters,
            options: undefined,
          }
        )

        data = resp2.data.data
        success = resp2.data.success
        error = resp2.data.error

        if (data && data.labels?.length > 0) {
          if (!silent) {
            if (!success || !data) node.display(error)
            else node.display('Top label is ' + data && data.labels)
          }
          console.log('resp2one is', resp2.data)
          highestScore = 0
          highestLabel = ''

          for (let i = 0; i < data.labels.length; i++) {
            if (data.scores[i] > highestScore) {
              highestScore = data.scores[i]
              highestLabel = data.labels[i]
            }
          }

          console.log('highest label 2:', highestLabel)
          is =
            highestLabel === 'information question' ||
            highestLabel === 'funnel question' ||
            highestLabel === 'data question'
        } else {
          is = false
        }
      }
    }

    console.log('is:', is)
    this._task.closed = is ? ['false'] : ['true']*/
  }
}
