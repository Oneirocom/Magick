process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

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

type WorkerReturn = {
  output: string
}

export class CreateOrGetAgent extends ThothComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Create Or Get Agent')

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
    const agentInput = new Rete.Input('agentName', 'Agent Name', stringSocket)
    const speakerInput = new Rete.Input('speaker', 'Speaker', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const agentOut = new Rete.Output('agent', 'Agent', agentSocket)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outp = new Rete.Output('output', 'output', stringSocket)

    return node
      .addInput(agentInput)
      .addInput(speakerInput)
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(agentOut)
      .addOutput(outp)
  }

  async worker(_node: NodeData, inputs: ThothWorkerInputs) {
    console.log('inputs:', inputs)
    const agentName = inputs['agentName'][0] as Agent
    const speaker = inputs['speaker'][0] as string

    const resp = await axios.post(
      `${process.env.API_URL}/createWikipediaEntity`,
      {
        speaker: speaker,
        agent: agentName,
      }
    )

    console.log(resp.data)

    return {
      output: resp.data?.result?.extract,
    }
  }
}
