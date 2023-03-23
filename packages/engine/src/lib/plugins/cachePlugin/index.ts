import { Component, Control } from 'rete'

import { MagickComponent } from '../../engine'
import {
  MagickEditor,
  MagickNode,
  WorkerData
} from '../../types'

import { Task } from '../taskPlugin'
import { RunButtonControl } from './RunLastArguments'

function install(editor: MagickEditor) {
  editor.on('componentregister', (_component: Component) => {
    const component = _component as unknown as MagickComponent<unknown>
    const worker = component.worker
    const builder = component.builder

    component.cache = {}

    /**
     * Here we create a worker wrapper that will cache all the arguments being sent in to worker for later use
     */
    component.worker = (node: WorkerData, inputs, outputs, context, ...args) => {
      component.cache[node.id] = {
        node,
        inputs,
        outputs,
        context,
        ...args,
      }

      return worker.apply(component, [node, inputs, outputs, context, ...args])
    }

    /**
     * Create a builder wrapper which will add on the run button if a compoonent has the proper   boolean defined on it.
     */
    component.builder = (_node: MagickNode) => {
      if (component.runFromCache) {
        // Run function runs the worker with old args and returns the result.
        const run = async (node: WorkerData) => {
          const cache = component.cache[node.id] as { inputs; outputs; context}

          if (!cache) return null

          const { inputs, outputs, context } = cache

          // Since running thos worker invokes the next plugin, task,
          // We have to grab that task, and run the original worker.
          const task = (await component.worker.apply(component, [
            node,
            inputs,
            outputs,
            context,
          ])) as Task

          const value = await task.worker(node, inputs, outputs, context)
          return value
        }

        const runControl = new RunButtonControl({ key: 'runControl', run })

        _node.addControl(runControl as Control)
      }

      return builder.call(component, _node)
    }
  })
}

const defaultExport = {
  name: 'cachePlugin',
  install,
}

export default defaultExport
