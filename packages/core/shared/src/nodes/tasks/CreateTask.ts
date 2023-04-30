// DOCUMENTED
import Rete from 'rete'
import { InputControl } from '../../dataControls/InputControl'
import { MagickComponent } from '../../engine'
import { eventSocket, stringSocket, taskSocket, triggerSocket } from '../../sockets'
import {
  AgentTask,
  CreateAgentTaskArgs,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  ModuleContext,
  WorkerData,
} from '../../types'

/**
 * Information about the CreateTask class
 */
const info = 'Create a new task which will be run by the agent'

/**
 * CreateTask class that extends MagickComponent
 */
export class CreateTask extends MagickComponent<Promise<{ task: AgentTask }>> {
  constructor() {
    super(
      'Create Task',
      { outputs: { task: 'output', trigger: 'option' } },
      'Task',
      info
    )
  }

  /**
   * Builder function to configure the node for task storage
   * @param node
   */
  builder(node: MagickNode) {
    const type = new InputControl({
      dataKey: 'type',
      name: 'Type',
      icon: 'moon',
      placeholder: 'task',
    })

    const objective = new Rete.Input('objective', 'Objective', stringSocket)
    node.inspector.add(type)

    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const event = new Rete.Input('event', 'Event', eventSocket)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const taskOutput = new Rete.Output('task', 'Task', taskSocket)
    return node
      .addInput(dataInput)
      .addInput(objective)
      .addInput(event)
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
    const { projectId } = context

    const objective = inputs['objective'][0] as string
    const event = inputs['event'][0] as Event

    const data = {
      objective,
      type: node.data.type,
      status: 'active',
      eventData: event,
      projectId,
      date: new Date(),
      steps: JSON.stringify([]),
    } as CreateAgentTaskArgs

    const { app } = context.module
    const taskResponse = await app?.service('tasks').create(data)
    console.log('taskResponse', taskResponse)
    // get the task data from the response
    const task = taskResponse as AgentTask
    // return the task
    return { task }
  }
}
