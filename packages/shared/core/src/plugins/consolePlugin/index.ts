// DOCUMENTED
/**
 * Typescript Module "consolePlugin"
 * @module consolePlugin
 */

import { MagickComponent } from '../../engine'
import { IRunContextEditor, MagickEditor, MagickNode } from '../../types'
import { MagickConsole } from './MagickConsole'

/**
 * Arguments passed to the `install` function
 * @typedef {Object} DebuggerArgs
 * @property {boolean} [server=false] - Determines if the debug console is run on a local or remote server.
 * @property {Function} [throwError] - Function that throws an error
 */

export type DebuggerArgs = {
  server?: boolean
  throwError?: (message: unknown) => void
}

/**
 * Installs debug mode in the app
 * @param {IRunContextEditor} editor - editor object
 * @param {DebuggerArgs} [{ server = false, throwError }] - DebuggerArgs object
 * @memberof module:consolePlugin
 */
function install(
  editor: IRunContextEditor,
  { server = false, throwError }: DebuggerArgs
) {
  editor.on('componentregister', (component: MagickComponent<unknown>) => {
    const worker = component.worker

    component.worker = async (node, inputs, outputs, data, ...args) => {
      const _node = node as unknown as MagickNode

      /**
       * Represents an instance of the debug console
       * @type {MagickConsole}
       * @memberof module:consolePlugin
       */
      node.console = new MagickConsole({
        node: _node,
        component,
        editor: editor as MagickEditor,
        server,
        throwError,
      })

      try {
        const result = await worker.apply(component, [
          node,
          inputs,
          outputs,
          data,
          ...args,
        ])

        const message = {
          outputs: result,
          inputs: inputs,
          data,
        }

        _node.console.log(message)

        return result
      } catch (error) {
        _node.console.error(error as Error)

        throw error
      }
    }
  })
}

/**
 * Default export object
 * @type {Object}
 * @property {string} name - name of the module
 * @property {Function} install - function that installs debug mode in the app
 * @memberof module:consolePlugin
 */
const defaultExport = {
  name: 'consolePlugin',
  install,
}

export default defaultExport
