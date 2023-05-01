// DOCUMENTED
import Rete from 'rete'
import { v4 as uuidv4 } from 'uuid'

import {
  InputControl,
  MagickComponent,
  MagickNode,
  MagickTask,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData,
  anySocket,
  eventSocket,
  taskSocket,
  triggerSocket,
} from '@magickml/core'

/** Information about the TaskInput functionality */
const info = `The TaskInput component allows you to receive data from the task runner.`

type InputReturn = {
  output: unknown
}

/**
 * TaskInput is a MagickComponent that handles user input
 */
export class TaskInput extends MagickComponent<InputReturn> {
  nodeTaskMap: Record<number, MagickTask> = {}

  constructor() {
    // Name of the component
    super(
      'Task Input',
      {
        outputs: {
          output: 'output',
          agentTask: 'output',
          trigger: 'option',
        },
      },
      'Task',
      info
    )

    this.module = {
      nodeType: 'input',
      socket: anySocket,
    }

    this.contextMenuName = 'Task Input'
    this.displayName = 'Task Input'
  }

  /**
   * Builder function for configuring the input component and adding controls to the node
   *
   * @param {MagickNode} node - The node being built
   * @returns {MagickNode} - The configured node
   */
  builder(node: MagickNode) {
    const taskType = new InputControl({
      dataKey: 'taskType',
      name: 'Task Type',
      icon: 'moon',
      defaultValue: 'agi',
    })

    taskType.onData = data => {
      node.data.name = `Input - Task(${data})`
    }

    // Set isInput to true so we can identify this node as an input node
    node.data.isInput = true

    // Each node should have a unique socket key
    node.data.socketKey = node?.data?.socketKey || uuidv4()

    // Set the default name if there is none
    if (!node.data.name) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      node.data.name ?? `Input - Task (${node.data.taskType})`
    }

    node.inspector.add(taskType)

    // Add the inputs and outputs to the node
    node.addOutput(new Rete.Output('output', 'Event', eventSocket))
    node.addOutput(new Rete.Output('trigger', 'Trigger', triggerSocket))
    node.addOutput(new Rete.Output('agentTask', 'Task', taskSocket))

    return node
  }

  worker(
    node: WorkerData,
    _inputs: MagickWorkerInputs,
    outputs: MagickWorkerOutputs,
    { data }: { data: string | undefined }
  ) {
    node.data.isInput = true

    console.log('HANDLING TASK')
    console.log('data', data)

    // if data is a string, parse it
    if (typeof data === 'string') {
      data = JSON.parse(data)
    }

    const output =
      (outputs && (outputs.output as any)) || data
        ? Object.values(data as any)[0]
        : undefined

    this._task.closed = ['trigger']

    const agentTask = (output as any).agentTask
    if (!agentTask) {
      throw new Error('No agent task found in input')
    }

    // remove agentTask from output
    // this is kind of a hack to get it in from the task runner
    delete (output as any).agentTask

    return {
      output,
      agentTask,
    }
  }
}
