/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
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

const info =
  'Random String From List returns a randomly selected string from an array, it keeps memory of recently selected strings'

const fewshot = ``

const recently_used: string[] = []
let clear: any = undefined

type WorkerReturn = {
  output: string
}

export class RandomStringFromList extends ThothComponent<
  Promise<WorkerReturn>
> {
  constructor() {
    super('Random Phrase From List')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }

    this.category = 'Strings'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    if (!node.data.fewshot) node.data.fewshot = fewshot

    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outp = new Rete.Output('output', 'String', stringSocket)

    const fewshotControl = new FewshotControl({})

    node.inspector.add(fewshotControl)

    return node.addInput(dataInput).addOutput(dataOutput).addOutput(outp)
  }

  async worker(node: NodeData) {
    const fewshot = node.data.fewshot as string
    const strings = fewshot.split('\n')
    if (strings.length <= 0) {
      return {
        output: '',
      }
    }

    let index = Math.floor(Math.random() * strings.length)
    if (recently_used.length == strings.length) {
      recently_used.splice(0, recently_used.length)
    }

    while (recently_used.includes(strings[index])) {
      index = Math.floor(Math.random() * strings.length)
    }

    recently_used.push(strings[index])
    if (clear !== undefined) {
      clearTimeout(clear)
      clear = setTimeout(() => {
        recently_used.splice(0, recently_used.length)
        clear = undefined
      }, 60000)
    }

    return {
      output: strings[index],
    }
  }
}
