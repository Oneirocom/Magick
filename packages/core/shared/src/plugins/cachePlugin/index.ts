// DOCUMENTED
import { Component, Control } from 'shared/rete'

import { MagickComponent } from '../../engine'
import { MagickEditor, MagickNode, WorkerData } from '../../types'

import { Task } from '../taskPlugin'
import { RunButtonControl } from './RunLastArguments'

/**
 * Installs the cache plugin to the provided editor.
 *
 * @param {MagickEditor} editor - The editor instance to install the plugin to.
 */
function install(editor: MagickEditor): void {
  editor.on('componentregister', (_component: Component) => {
    const component = _component as MagickComponent<unknown>
    const originalWorker = component.worker
    const originalBuilder = component.builder

    component.cache = {}

    /**
     * Worker wrapper function. Caches the arguments passed to the worker for later use.
     */
    component.worker = (
      node: WorkerData,
      inputs,
      outputs,
      context,
      ...args
    ) => {
      component.cache[node.id] = {
        node,
        inputs,
        outputs,
        context,
        ...args,
      }

      return originalWorker.apply(component, [
        node,
        inputs,
        outputs,
        context,
        ...args,
      ])
    }

    /**
     * Builder wrapper function. Adds a run button to the component if the 'runFromCache' property is true.
     */
    component.builder = (_node: MagickNode) => {
      if (component.runFromCache) {
        /**
         * The run function that runs the worker with cached arguments and returns the result.
         *
         * @param {WorkerData} node - The worker data to run.
         * @returns {Promise<unknown> | null} The result of the worker or null if the data is not cached.
         */
        const run = async (node: WorkerData) => {
          const cache = component.cache[node.id] as { inputs; outputs; context }

          if (!cache) return null

          const { inputs, outputs, context } = cache

          // Run the original worker and get the task.
          const task = (await originalWorker.apply(component, [
            node,
            inputs,
            outputs,
            context,
          ])) as Task

          // Run the task's worker and return the result.
          const value = await task.worker(node, inputs, outputs, context)
          return value
        }

        const runControl = new RunButtonControl({ key: 'runControl', run })

        // Add the run control to the node.
        _node.addControl(runControl as Control)
      }

      return originalBuilder.call(component, _node)
    }
  })
}

const defaultExport = {
  name: 'cachePlugin',
  install,
}

export default defaultExport
