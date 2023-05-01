// DOCUMENTED
import Rete from 'rete'
import { MagickComponent } from '../../engine'
import {
  stringSocket,
  taskSocket,
  triggerSocket
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
export class FinishTaskStep extends MagickComponent<Promise<{ agentTask: AgentTask }>> {
  constructor() {
    super('Finish Task Step', { outputs: { trigger: 'option', agentTask: 'output' } }, 'Task', info)
  }

  /**
   * Builder function to configure the node for task storage
   * @param node
   */
  builder(node: MagickNode) {
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    // Each task step starts with a thought in response to "what do I want to do next?"
    const thought = new Rete.Input('thought', 'Thought', stringSocket)
    // The skill used to complete the task step (UUID of graph is ideal here)
    const skill = new Rete.Input('skill', 'Skill', stringSocket)
    // Data from the running task
    const task = new Rete.Input('agentTask', 'Task', taskSocket)
    // A description of how the agent will use the skill to complete the task step
    const action = new Rete.Input('action', 'Action', stringSocket)
    // Resulting output of the skill
    const result = new Rete.Input('result', 'Result', stringSocket)
    // TODO: We can add a reflection step here to evaluate the result and determine if the task step was successful
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const taskOutput = new Rete.Output('agentTask', 'Task', taskSocket)
    return node
      .addInput(dataInput)
      .addInput(task)
      .addInput(thought)
      .addInput(skill)
      .addInput(action)
      .addInput(result)
      .addOutput(dataOutput)
      .addOutput(taskOutput)
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
    const task = inputs['agentTask'][0] as AgentTask
    const thought = inputs['thought'][0] as string
    const skill = inputs['skill'][0] as string
    const action = inputs['action'][0] as string
    const result = inputs['result'][0] as string

    console.log('task.steps', task.steps)

    const step = {
      thought,
      action,
      skill,
      result,
    }

    const steps = JSON.parse(task.steps || '[]')

    // push the step to the task
    steps.push(step)

    const { app } = context.module
    // call feathers task service to update the task
    const taskResult = await app?.service('tasks').patch(task.id, {steps: JSON.stringify(steps)})
    return {
      agentTask: taskResult,
    }
  }
}
