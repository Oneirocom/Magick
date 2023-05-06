import { Component } from 'rete'
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
  editor.on('componentregister', (_component: Component) => {
    editor.tasks = []

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
      // Task caller is what actually gets run once the task runs itself.  It is called inside the run function.
      const taskCaller = async (
        _ctx: unknown,
        inputs: MagickWorkerInputs,
        data: NodeData,
        socketInfo: TaskSocketInfo | string | null
      ) => {
        component._task = task
        // TODO: might change this interface, since we swap out data for outputs here, which just feels wrong.
        // TODO: Also improve typing of TaskWorker when done

        // todo we need to handle errors properly at the task module level so they are passed out and to the agent properly.
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

      const task = new Task(inputs, component, node, taskCaller)

      component.nodeTaskMap[node.id] = task
      if (taskOptions.init) taskOptions.init(task, node)

      // Since some outputs are generated dynamically based on data stored in the node
      // we need to add those as outputs to the taskOptions when we set up the allowed outputs of the task.
      // We do this here because this worker is the one run on process to set up the task runflow
      // And it pauses after this until the task run function is called.
      const taskOutputs = addTaskOutputs(node)
      const allOutputs = {
        ...taskOutputs,
        ...taskOptions.outputs,
      }

      Object.keys(allOutputs).forEach(key => {
        outputs[key] = { type: taskOptions.outputs[key], key, task }
      })

      // Probably need to reset this when spells change
      editor.tasks.push(task)

      return task
    }
  })
}

export { Task } from './task'

const defaultExport = {
  name: 'task',
  install,
}

export default defaultExport
