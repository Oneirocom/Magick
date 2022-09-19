/* eslint-disable no-async-promise-executor */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Rete from 'rete'

import { Agent, NodeData, ThothNode, ThothWorkerInputs } from '../../types'
import { triggerSocket, stringSocket, agentSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info = 'Agent Text Completion is using OpenAI for the agent to respond.'

type WorkerReturn = {
  output: string
}

export class AddAgent extends ThothComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Add Agent')

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
    const inp = new Rete.Input('string', 'Text', stringSocket)
    const agent = new Rete.Input('agent', 'Agent', agentSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outp = new Rete.Output('output', 'output', stringSocket)

    return node
      .addInput(inp)
      .addInput(agent)
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(outp)
  }

  async worker(_node: NodeData, inputs: ThothWorkerInputs) {
    const action = inputs['string'][0] as string
    const agent = inputs['agent'][0] as Agent

    return {
      output: action + '\n' + agent.agent + ': ',
    }
  }
}
