// DOCUMENTED
import {
  MagickComponent,
  MagickNode,
  MagickWorkerInputs,
  WorkerData,
  taskSocket,
  triggerSocket,
} from '@magickml/core'
import Rete from 'rete'

const info = 'Delete a task.'

/**
 * A Rete component representing an task deletion node in the visual programming editor.
 */
export class DeleteTask extends MagickComponent<Promise<void>> {
  constructor() {
    super(
      'Delete Task',
      {
        outputs: {
          trigger: 'option',
        },
      },
      'Task',
      info
    )
  }

  /**
   * Assembles the node component in the visual programming editor.
   * @param node - The node to add inputs and outputs to.
   * @returns The assembled node with inputs and outputs.
   */
  builder(node: MagickNode) {
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const task = new Rete.Input('task', 'Task', taskSocket)

    return node.addOutput(dataOutput).addInput(dataInput).addInput(task)
  }

  /**
   * Executes the task deletion logic.
   *
   * @param node - Node data from the visual programming editor.
   * @param inputs - Node input values from connected inputs in the editor.
   */
  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    outputs: any,
    context: any
  ) {
    try {
      const task = inputs.task[0] as { id: number }

      const { app } = context.module

      // update the task status to cancelled
      return await app.service('tasks').remove(task.id)
    } catch (e) {
      throw new Error(`Error cancelling task: ${e}`)
    }
  }
}
