import { IRunContextEditor, NodeData, MagickComponent } from '../../../types'
import { MagickConsole } from '../debuggerPlugin/MagickConsole'

function install(
  engine: IRunContextEditor,
  { server = false, throwError }: { server?: boolean; throwError?: Function }
) {
  engine.on(
    'error',
    ({ message, data }: { message: string; data: NodeData }) => {
      const component = engine.components.get(
        data.name
      ) as unknown as MagickComponent<unknown>

      if (!component) return

      const console = new MagickConsole({
        node: data,
        component,
        editor: engine,
        server,
        throwError,
        isEngine: true,
      })

      if (message === 'Recursion detected') {
        const error = new Error(`Recursion occured in node ID ${data.id}`)

        console.error(error)
      }
    }
  )
}

const defaultExport = {
  name: 'errorPlugin',
  install,
}

export default defaultExport
