/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import axios from 'axios'
import Rete from 'rete'

import { Agent, NodeData, ThothNode, ThothWorkerInputs } from '../../types'
import { triggerSocket, stringSocket, agentSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info = 'Create Or GetAgent is used to generate or get an existing agent'

export class GetAgent extends ThothComponent<Promise<void>> {
  constructor() {
    super('Get Agent')

    this.task = {
      outputs: {
        agent: 'output',
        success: 'output',
        trigger: 'option',
      },
    }

    this.category = 'Agents'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    const agentInput = new Rete.Input('agentName', 'Agent Name', stringSocket)
    const speakerInput = new Rete.Input('speaker', 'Speaker', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const agentOut = new Rete.Output('agent', 'Agent', agentSocket)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    return node
      .addInput(agentInput)
      .addInput(speakerInput)
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(agentOut)
  }

  async worker(_node: NodeData, inputs: ThothWorkerInputs) {
    const agentName = inputs['agentName'][0] as Agent
    const speaker = inputs['speaker'][0] as string

    const resp = await axios.post(
      `${import.meta.env.VITE_APP_API_ROOT_URL}/createWikipediaEntity`,
      {
        speaker: speaker,
        agentName,
      }
    )

    console.log(resp.data)
  }
}
