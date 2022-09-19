process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

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

const info = 'Form Opinion About Speaker'

async function storeMatrix(agent: string, speaker: string, matrix: string) {
  const response = await axios.post(
    `${process.env.REACT_APP_API_ROOT_URL}/relationship_matrix`,
    {
      agent: agent,
      speaker: speaker,
      matrix: matrix,
    }
  )

  console.log(response.data)
}

export class OpinionAboutSpeakerSet extends ThothComponent<Promise<void>> {
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
    const agentInput = new Rete.Input('agent', 'Agent', agentSocket)
    const speakerInput = new Rete.Input('speaker', 'Speaker', stringSocket)
    const matrixInp = new Rete.Input(
      'matrix',
      'Relationship Matrix',
      stringSocket
    )
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    return node
      .addInput(matrixInp)
      .addInput(agentInput)
      .addInput(speakerInput)
      .addInput(dataInput)
      .addOutput(dataOutput)
  }

  async worker(_node: NodeData, inputs: ThothWorkerInputs) {
    const speaker = inputs['speaker'][0] as string
    const agent = (inputs['agent'][0] as Agent).agent
    const matrix = inputs['matrix'][0] as string

    const resp = await storeMatrix(agent, speaker, matrix)
    console.log(resp)
  }
}
