import { IRunContextEditor } from '../../types'
import { ThothComponent } from '../../thoth-component'
import { ThothConsole } from './ThothConsole'

function install(
  editor: IRunContextEditor,
  { server = false, throwError }: { server?: boolean; throwError?: Function }
) {
  editor.on('componentregister', (component: ThothComponent<unknown>) => {
    const worker = component.worker

    component.worker = async (node, inputs, outputs, data, ...args) => {
      node.console = new ThothConsole({
        node,
        component,
        editor,
        server,
        throwError,
      })

      try {
        let result = await worker.apply(component, [
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
