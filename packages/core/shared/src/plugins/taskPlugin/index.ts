import { Component } from 'shared/rete'
import { NodeData, WorkerOutputs } from 'rete/types/core/data'

import {
  MagickEditor,
  MagickWorkerInputs,
  ModuleContext,
  WorkerData,
} from '../../types'

import { MagickComponent } from '../../engine'
import { Task, TaskSocketInfo } from './task'

function install(editor: MagickEditor) {
  const taskStore = {}

  function getTask(nodeId) {
    return taskStore[nodeId]
  }

  function getTasks() {
    return taskStore
  }

  editor.getTask = getTask
  editor.getTasks = getTasks

  editor.on('componentregister', (_component: Component) => {
    const component = _component as unknown as MagickComponent<unknown>

    if (!component.task)
      return console.error('Task plugin requires a task property in component')

    if (component.task.outputs.constructor !== Object)
      return console.error(
        'The "outputs" field must be an object whose keys correspond to the Output\'s keys'
      )

    const addTaskOutputs = (node: NodeData) => {
      const outputs = node.data.outputs as []
      let taskOutputs = {}
      if (node.data.outputs && outputs.length > 0) {
        taskOutputs = outputs.reduce(
          (acc: Record<string, unknown>, out: Record<string, unknown>) => {
            acc[out.socketKey as string] = out.taskType || 'output'
            return acc
          },
          { ...component.task.outputs }
        )

        component.task.outputs = taskOutputs
      }

      return taskOutputs
    }

    const taskWorker = component.worker
    const taskOptions = component.task

    component.worker = (
      node: WorkerData,
      inputs: MagickWorkerInputs,
      outputs: WorkerOutputs,
      context: ModuleContext,
      ...rest
    ) => {
      // Dynamically add the tasks output options from the node
      const taskOutputs = addTaskOutputs(node)
      const allOutputs = {
        ...taskOutputs,
        ...taskOptions.outputs,
      }

      // Task caller is what actually gets run once the task runs itself.  It is called inside the run function.
      const taskCaller = async (
        _ctx: unknown,
        inputs: MagickWorkerInputs,
        data: NodeData,
        socketInfo: TaskSocketInfo | string | null
      ) => {
        // runs the original worker function to get the value
        const result = await taskWorker.call(
          component,
          node,
          inputs,
          outputs,
          { ...context, data, socketInfo },
          ...rest
        )

        // TODO: Make sure that the result is correct
        return result as Record<string, unknown> | null
      }

      // Create the main task
      const task = new Task(inputs, component, node.id, taskCaller, getTask)

      // adding task to the node so sockets can be closed
      node._task = task

      // add the task to the task store
      taskStore[node.id] = task

      // Make sure all outputs are added
      Object.keys(allOutputs).forEach(key => {
        outputs[key] = { type: taskOptions.outputs[key], key, nodeId: node.id }
      })

      // init the task on the components task options if needed
      if (taskOptions.init) taskOptions.init(task as any, node)
    }
  })
}

export { Task } from './task'

const defaultExport = {
  name: 'task',
  install,
}

export default defaultExport
