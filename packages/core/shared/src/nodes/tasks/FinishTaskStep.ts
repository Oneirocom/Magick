// DOCUMENTED
import Rete from 'rete'
import { InputControl } from '../../dataControls/InputControl'
import { MagickComponent } from '../../engine'
import {
  eventSocket,
  stringSocket,
  taskSocket,
  triggerSocket,
} from '../../sockets'
import {
  AgentTask,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  ModuleContext,
  WorkerData,
} from '../../types'

/**
 * Information about the CreateTask class
 */
const info = 'Finish the current step of the task'

/**
 * CreateTask class that extends MagickComponent
 */
export class FinishTaskStep extends MagickComponent<Promise<void>> {
  constructor() {
    super('Finish Task Step', { outputs: { trigger: 'option' } }, 'Task', info)
  }

  /**
   * Builder function to configure the node for task storage
   * @param node
   */
  builder(node: MagickNode) {
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const thought = new Rete.Input('thought', 'Thought', stringSocket)
    const skill = new Rete.Input('skill', 'Skill', stringSocket)
    const task = new Rete.Input('task', 'Task', taskSocket)
    const action = new Rete.Input('action', 'Action', stringSocket)
    const result = new Rete.Input('result', 'Result', stringSocket)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    return node
      .addInput(dataInput)
      .addInput(thought)
      .addInput(skill)
      .addInput(task)
      .addInput(result)
      .addOutput(dataOutput)
  }

  /**
   * Worker function to process and store the task
   * @param node
   * @param inputs
   * @param _outputs
   * @param context
   */
  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    context: ModuleContext
  ) {
    const task = inputs['task'][0] as AgentTask
    const thought = inputs['thought'][0] as string
    const skill = inputs['skill'][0] as string
    const action = inputs['action'][0] as string
    const result = inputs['result'][0] as string

    const step = {
      timestamp: Date.now(),
      input: task,
      thought,
      action,
      skill,
      result,
    }

    // push the step to the task
    task.steps.push(step)

    const { app } = context.module
    // call feathers task service to update the task
    await app?.service('tasks').patch(task.id, {
      result,
      step,
    })
  }
}
