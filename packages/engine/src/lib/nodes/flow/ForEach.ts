import Rete from 'rete'

import {
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
} from '../../types'
import { arraySocket, triggerSocket, anySocket } from '../../sockets'
import { MagickComponent, MagickTask } from '../../magick-component'
const info = `The forEach component takes in an array, and will iterate over each item in the array, firing a new trigger signal with the appropriate value, until all items in the array have been processed.`

type WorkerReturn = {
  element?: string | string[] | unknown | {}
} | void

export class ForEach extends MagickComponent<Promise<WorkerReturn | undefined>> {
  constructor() {
    super('ForEach')
    this.task = {
      outputs: { act: 'option', element: 'output', done: 'option' },
    }
    this.category = 'Flow'
    this.info = info
  }

  builder(node: MagickNode) {
    const inp0 = new Rete.Input('act1', 'Data', triggerSocket, true)
    const inp1 = new Rete.Input('array', 'Array', arraySocket)
    const out1 = new Rete.Output('act', 'Data', triggerSocket)
    const out2 = new Rete.Output('element', 'Item', anySocket)
    const out3 = new Rete.Output('done', 'Done', triggerSocket)

    return node
      .addInput(inp0)
      .addInput(inp1)
      .addOutput(out1)
      .addOutput(out2)
      .addOutput(out3)
  }

  async worker(
    _node: NodeData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    { element }: { element: unknown }
  ) {
    if (element === undefined) {
      const inputsArray = inputs.array[0] as unknown[]

      try {
        await Promise.all(
          inputsArray.map((el: unknown) =>
            this._task
              .clone(false, {} as MagickTask, {} as MagickTask)
              .run({ element: el })
          )
        )
      } catch (err) {
        return console.error('Error in ForEach Component.')
      }

      this._task.closed = ['act']
      return {}
    } else {
      this._task.closed = ['done']
      return { element }
    }
  }
}
