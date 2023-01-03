import { Component, Control } from 'rete'

import {
  NodeData,
  ThothComponent,
  ThothEditor,
  ThothNode,
} from '../../../types'
import { RunButtonControl } from './RunLastArguments'

function install(editor: ThothEditor) {
  editor.on('componentregister', (_component: Component) => {
    const component = _component as unknown as ThothComponent<unknown>
    const worker = component.worker
    const builder = component.builder

    component.cache = {}

    /**
     * Here we create a worker wrapper that will cache all the arguments being sent in to worker for later use
     */
    component.worker = (node: NodeData, inputs, outputs, context, ...args) => {
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
    component.builder = (node: ThothNode) => {
      if (component.runFromCache) {
        // Run function runs the worker with old args and returns the result.
        const run = async (node: NodeData) => {
          const cache = component.cache[node.id]

          if (!cache) return null

          const { inputs, outputs, context } = cache

          // Since running thos worker invokes the next plugin, task,
          // We have to grab that task, and run the original worker.
          const task = await component.worker.apply(component, [
            node,
            inputs,
            outputs,
            context,
          ])

          const value = await task.worker(node, inputs, outputs, context)
          return value
        }

        const runControl = new RunButtonControl({ key: 'runControl', run })

        node.addControl(runControl as Control)
      }

      return builder.call(component, node)
    }
  })
}

const defaultExport = {
  name: 'cachePlugin',
  install,
}

export default defaultExport
