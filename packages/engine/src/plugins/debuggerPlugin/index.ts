import { IRunContextEditor } from '../../../types'
import { MagickConsole } from './MagickConsole'

export type DebuggerArgs = { server?: boolean; throwError?: Function }

function install(
  editor: IRunContextEditor,
  { server = false, throwError }: DebuggerArgs
) {
  editor.on('componentregister', (component: any) => {
    const worker = component.worker

    component.worker = async (node, inputs, outputs, data, ...args) => {
      node.console = new MagickConsole({
        node,
        component,
        editor,
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

        node.console.log(result)

        return result
      } catch (error: any) {
        node.console.error(error)
        throw error
      }
    }
  })
}

const defaultExport = {
  name: 'debuggerPlugin',
  install,
}

export default defaultExport
