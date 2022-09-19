process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

/* eslint-disable no-async-promise-executor */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import axios from 'axios'
import Rete from 'rete'

import {
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
  EngineContext,
} from '../../types'
// import { InputControl } from '../../dataControls/InputControl'
import { SocketGeneratorControl } from '../../dataControls/SocketGenerator'
import { triggerSocket, stringSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info =
  'Variable Replacer is used to replace keywords with new values in a text input.'

type WorkerReturn = {
  output: string
}

export class VariableReplacer extends ThothComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Variable Replacer')

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
    const strInput = new Rete.Input('inp', 'Input', stringSocket)
    const agentInput = new Rete.Input('agent', 'Agent', stringSocket)
    const speakerInput = new Rete.Input('speaker', 'Speaker', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outp = new Rete.Output('output', 'output', stringSocket)

    const inputGenerator = new SocketGeneratorControl({
      connectionType: 'input',
      name: 'Input Sockets',
      ignored: ['trigger'],
    })

    node.inspector.add(inputGenerator)

    return node
      .addInput(strInput)
      .addInput(agentInput)
      .addInput(speakerInput)
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(outp)
  }

  async worker(_node: NodeData, rawInputs: ThothWorkerInputs) {
    let input = rawInputs['inp'][0] as string
    const agent = rawInputs['agent'][0] as string
    const speaker = rawInputs['speaker'][0] as string
    const inputs: any = Object.entries(rawInputs).reduce(
      (acc, [key, value]) => {
        console.log('key:', key, 'value:', value)
        acc[key] = value[0]
        return acc
      },
      {} as Record<string, unknown>
    )

    for (const key in inputs) {
      if (input.includes(key)) {
        if (key === 'agent') {
          input = input.replace(key, agent)
        } else if (key === 'speaker') {
          input = input.replace(key, speaker)
        } else {
          input = input.replace(key, inputs[key])
        }
      }
    }

    return {
      output: input,
    }
  }
}
