import { MagickComponent } from '../../engine';
import { IRunContextEditor, MagickNode } from '../../types';
import { MagickConsole } from '../consolePlugin/MagickConsole';

function install(
  engine: IRunContextEditor,
  { server = false, throwError }: { server?: boolean; throwError?: Function }
) {
  engine.on(
    'error',
    ({ message, data }: { message: string; data: MagickNode }) => {
      const component = engine.components.get(
        data.name as string
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
