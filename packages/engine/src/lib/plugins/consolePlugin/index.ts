import { MagickComponent } from '../../engine';
import { IRunContextEditor, MagickNode } from '../../types'
import { MagickConsole } from './MagickConsole'

export type DebuggerArgs = { server?: boolean; throwError?: (message:unknown)=>void }

function install(
  editor: IRunContextEditor,
  { server = false, throwError }: DebuggerArgs
) {
  editor.on('componentregister', (component: MagickComponent<unknown>) => {
    const worker = component.worker

    component.worker = async (node, inputs, outputs, data, ...args) => {
      const _node = node as unknown as MagickNode
      node.console = new MagickConsole({
        node: _node,
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

        _node.console.log(result)

        return result
      } catch (error) {
        _node.console.error(error as Error)
        return console.error(error)
      }
    }
  })
}

const defaultExport = {
  name: 'consolePlugin',
  install,
}

export default defaultExport
