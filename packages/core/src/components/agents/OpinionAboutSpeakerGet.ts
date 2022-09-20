/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios'
import Rete from 'rete'

import {
  Agent,
  EngineContext,
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../types'
import { triggerSocket, stringSocket, agentSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info = 'Get Opinion About Speaker'

type InputReturn = {
  output: unknown
}

export async function getMatrix(agent: string, speaker: string) {
  const response = await axios.get(
    `${
      import.meta.env.VITE_APP_API_ROOT_URL
    }/relationship_matrix?agent=${agent}&speaker=${speaker}`
  )
  return response.data
}

export class OpinionAboutSpeakerGet extends ThothComponent<
  Promise<InputReturn>
> {
  constructor() {
    super('Opinion About Speaker Get')

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
    const agentInput = new Rete.Input('agent', 'Agent', agentSocket)
    const speakerInput = new Rete.Input('speaker', 'Speaker', stringSocket)
    const matrixOut = new Rete.Output('output', 'Matrix', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    return node
      .addInput(dataInput)
      .addInput(agentInput)
      .addInput(speakerInput)
      .addOutput(dataOutput)
      .addOutput(matrixOut)
  }

  async worker(_node: NodeData, inputs: ThothWorkerInputs) {
    const speaker = inputs['speaker'][0] as string
    const agent = (inputs['agent'][0] as Agent).agent

    const matrix = await getMatrix(agent, speaker)

    return {
      output:
        matrix.length > 0 && matrix !== 'internal error'
          ? matrix
          : JSON.stringify({
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
            }),
    }
  }
}
