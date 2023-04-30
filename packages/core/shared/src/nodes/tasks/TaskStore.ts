// DOCUMENTED 
import Rete from 'rete';
import { InputControl } from '../../dataControls/InputControl';
import { MagickComponent } from '../../engine';
import {
  arraySocket,
  taskSocket,
  stringSocket,
  triggerSocket
} from '../../sockets';
import {
  AgentTask,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  ModuleContext,
  WorkerData
} from '../../types';

/**
 * Information about the TaskStore class
 */
const info = 'Task Store is used to store tasks for an task and user'

/**
 * TaskStore class that extends MagickComponent
 */
export class TaskStore extends MagickComponent<Promise<void>> {
  constructor() {
    super('Store Task', { outputs: { trigger: 'option' } }, 'Task', info)
  }

  /**
   * Builder function to configure the node for task storage
   * @param node
   */
  builder(node: MagickNode) {
    const nameInput = new InputControl({
      dataKey: 'name',
      name: 'Input name',
      placeholder: 'Conversation',
    })

    const type = new InputControl({
      dataKey: 'type',
      name: 'Type',
      icon: 'moon',
      placeholder: 'conversation',
    })

    const contentInput = new Rete.Input('content', 'Content', stringSocket)
    const senderInput = new Rete.Input(
      'sender',
      'Sender Override',
      stringSocket
    )
    const taskInput = new Rete.Input('task', 'Task', taskSocket)
    const embedding = new Rete.Input('embedding', 'Embedding', arraySocket)

    node.inspector.add(nameInput).add(type)

    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    return node
      .addInput(dataInput)
      .addInput(contentInput)
      .addInput(senderInput)
      .addInput(taskInput)
      .addInput(embedding)
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
    context: ModuleContext,
  ) {
    const { projectId } = context

    const task = inputs['task'][0] as AgentTask
    const sender = (inputs['sender'] ? inputs['sender'][0] : null) as string
    let content = (inputs['content'] ? inputs['content'][0] : null) as string
    let embedding = (
      inputs['embedding'] ? inputs['embedding'][0] : null
    ) as number[]

    if (typeof embedding == 'string') {
      embedding = (embedding as string).split(',').map(x => parseFloat(x))
    }

    const typeData = node?.data?.type as string

    const type =
      typeData !== undefined && typeData.length > 0
        ? typeData.toLowerCase().trim()
        : 'none'

    if (!content) {
      content = (task as AgentTask).content || 'Error'
      if (!content) console.log('Content is null, not storing the task !!')
    }

    type Data = {
      sender: string
      projectId: string
      content: string
      type: string
      embedding?: number[] | string[]
    }

    const data: Data = {
      ...task,
      sender: sender ?? task.sender,
      projectId,
      content,
      type,
    }

    if (embedding) data.embedding = embedding

    if (content && content !== '') {
      const { app } = context.module;
      if(!app) throw new Error('App is not defined, cannot create task');
      const result = await app.service('tasks').create(data);
      console.log("Result of task creation", result)
    } else {
      throw new Error('Content is empty, not storing the task !!')
    }
  }
}
