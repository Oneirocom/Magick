import { NodeData } from '@magickml/rete'
import { Task } from './task'

export type TaskOptions = {
  outputs: Record<string, unknown>
  runOneInput?: boolean
  init?: (task: Task | undefined, node: NodeData) => void
}

function install(editor) {
  const taskStore = {}

  function getTask(nodeId) {
    return taskStore[nodeId]
  }

  function getTasks() {
    return taskStore
  }

  editor.getTask = getTask
  editor.getTasks = getTasks

  editor.on('componentregister', component => {
    if (!component.task)
      throw new Error('Task plugin requires a task property in component')
    if (component.task.outputs.constructor !== Object)
      throw new Error(
        'The "outputs" field must be an object whose keys correspond to the Output\'s keys'
      )

    const taskWorker = component.worker
    const taskOptions = component.task

    component.worker = (node, inputs, outputs) => {
      const task = new Task(inputs, component, (ctx, inps, data) => {
        return taskWorker.call(ctx, node, inps, data)
      })

      if (taskOptions.init) taskOptions.init(task, node)

      Object.keys(taskOptions.outputs).forEach(key => {
        outputs[key] = { type: taskOptions.outputs[key], key, task }
      })

      taskStore[node.id] = task
    }
  })
}

export { Task } from './task'

const defaultExport = {
  name: 'task',
  install,
}

export default defaultExport
