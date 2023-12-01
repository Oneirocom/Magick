// DOCUMENTED
import {
  AgentTask,
  MagickComponent,
  MagickNode,
  MagickWorkerInputs,
  WorkerData,
  taskSocket,
  triggerSocket,
} from 'shared/core'
import Rete from 'shared/rete'

const info = 'Cancel a task.'

/**
 * A Rete component representing an task deletion node in the visual programming editor.
 */
export class CancelTask extends MagickComponent<Promise<{ task: AgentTask }>> {
  constructor() {
    super(
      'Cancel Task',
      {
        outputs: {
          trigger: 'option',
          task: 'output',
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
      console.log('inputs', inputs)
      const task = inputs.task[0] as { id: number }
      console.log('inputs.task[0]', inputs.task[0])

      const { app } = context.module

      // update the task status to cancelled
      const updatedTask = await app.service('tasks').patch(task.id, {
        status: 'cancelled',
      })
      return {
        task: updatedTask,
      }
    } catch (e) {
      throw new Error(`Error cancelling task: ${e}`)
    }
  }
}
