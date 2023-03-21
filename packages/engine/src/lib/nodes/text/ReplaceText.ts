/* eslint-disable no-async-promise-executor */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Rete from 'rete'

import {
  NodeData,
  MagickNode,
  MagickWorkerInputs,
} from '../../types'
import { InputControl } from '../../dataControls/InputControl'
import { triggerSocket, stringSocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'

const info =
  'Replace Text is used to replace one string with another. Useful for variable injection.'

type WorkerReturn = {
  output: string
}

export class ReplaceText extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Replace Text')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }

    this.category = 'Text'
    this.display = true
    this.info = info
  }

  builder(node: MagickNode) {
    // should be nameable
    const name = new InputControl({
      dataKey: 'name',
      name: 'Name',
      icon: 'moon',
    })
    const match = new InputControl({
      dataKey: 'match',
      name: 'Match',
      icon: 'moon',
    })
    const replace = new InputControl({
      dataKey: 'replace',
      name: 'Replace',
      icon: 'moon',
    })

    node.inspector.add(name).add(match).add(replace)

    const strInput = new Rete.Input('input', 'Input', stringSocket)
    const agentInput = new Rete.Input('match', 'Match', stringSocket)
    const speakerInput = new Rete.Input('replace', 'Replace', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outp = new Rete.Output('output', 'output', stringSocket)

    return node
      .addInput(dataInput)
      .addInput(strInput)
      .addInput(agentInput)
      .addInput(speakerInput)
      .addOutput(dataOutput)
      .addOutput(outp)
  }

  async worker(node: NodeData, rawInputs: MagickWorkerInputs) {
    let input = rawInputs['input'][0] as string

    const match = ((rawInputs['match'] && rawInputs['match'][0]) ||
      node?.data?.match) as string
    const replace = ((rawInputs['replace'] && rawInputs['replace'][0]) ||
      node?.data?.replace) as string

    try {
      input = input.replaceAll(match, replace ?? '')
    } catch {
      console.error('Replace Text Error')
    }

    return {
      output: input,
    }
  }
}
