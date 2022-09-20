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

const info = 'Form Opinion About Speaker'

const fewshot = `Enemy
Friend
Student
Teacher
Repulsed
Attracted
Honest
Manipulative`

type InputReturn = {
  output: unknown
}

export class FormOpinionAboutSpeaker extends ThothComponent<
  Promise<InputReturn>
> {
  constructor() {
    super('Form Opinion About Speaker')

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
    node.data.fewshot = fewshot

    const inp = new Rete.Input('string', 'Input String', stringSocket)
    const inpMatrix = new Rete.Input('matrix', 'Input Matrix', stringSocket)
    const matrixOut = new Rete.Output('output', 'Output Matrix', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    const fewshotControl = new FewshotControl({})

    node.inspector.add(fewshotControl)

    return node
      .addInput(inp)
      .addInput(inpMatrix)
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(matrixOut)
  }

  async worker(node: NodeData, inputs: ThothWorkerInputs) {
    const matrix = inputs['matrix'][0] as string
    const action = inputs['string'][0]
    const params = node.data.fewshot as string

    const _matrix =
      matrix.length <= 0 || matrix === 'internal error'
        ? {
            Enemy: 0,
            Friend: 0,
            Student: 0,
            Teacher: 0,
            Repulsed: 0,
            Attracted: 0,
            Honest: 0,
            Manipulative: 0,

            EnemyLimit: 1,
            FriendLimit: 1,
            StudentLimit: 1,
            TeacherLimit: 1,
            RepulsedLimit: 1,
            AttractedLimit: 1,
          }
        : JSON.parse(matrix)

    const alpha = 0.01 // how much better or worse does the bot start to feel about someone?

    const decay = 0.001 // Decay rate of relationships as you chat with agent

    const parameters = params.split('\n').filter(function (el) {
      return el.length > 0
    })
    const _parameters = { candidate_labels: parameters }

    const resp = await axios.post(
      `${import.meta.env.VITE_APP_API_URL}/hf_request`,
      {
        inputs: action as string,
        model: 'facebook/bart-large-mnli',
        parameters: _parameters,
        options: undefined,
      }
    )

    const { success, data } = resp.data

    const result: any = success ? data : null

    if (result) {
      const resultMatrix: { [key: string]: any } = {}
      for (let i = 0; i < result.labels.length; i++) {
        resultMatrix[result.labels[i]] = result.scores[0]
      }

      for (const key of Object.keys(resultMatrix)) {
        _matrix[key] = Math.max(
          0,
          _matrix[key] + sigmoid(_matrix[key]) * alpha - decay
        )
      }
    }

    return {
      output: JSON.stringify(_matrix),
    }
  }
}

function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x))
}
