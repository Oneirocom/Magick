import { IRunContextEditor, NodeData, ThothComponent } from '../../../types'
import { ThothConsole } from '../debuggerPlugin/ThothConsole'

function install(
  engine: IRunContextEditor,
  { server = false, throwError }: { server?: boolean; throwError?: Function }
) {
  engine.on(
    'error',
    // disable typescript error 2345
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ({ message, data }: { message: string; data: NodeData }) => {
      const component = engine.components.get(
        data.name
      ) as unknown as ThothComponent<unknown>

      if (!component) return

      const console = new ThothConsole({
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
