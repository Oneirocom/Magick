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

const info = 'Complete a task.'

/**
 * A Rete component representing an task deletion node in the visual programming editor.
 */
export class CompleteTask extends MagickComponent<
  Promise<{ task: AgentTask }>
> {
  constructor() {
    super(
      'Complete Task',
      {
        outputs: {
          task: 'output',
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
    const taskOutput = new Rete.Output('task', 'Task', taskSocket)
    const task = new Rete.Input('task', 'Task', taskSocket)

    return node
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addInput(task)
      .addOutput(taskOutput)
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
      const updatedTask = await app.service('tasks').patch(task.id, {
        status: 'completed',
      })
      return {
        task: updatedTask,
      }
    } catch (e) {
      throw new Error(`Error completing task: ${e}`)
    }
  }
}
