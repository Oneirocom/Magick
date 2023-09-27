import { MagickComponent } from '../../engine'
import { IRunContextEditor } from '../../types'

function install(editor: IRunContextEditor) {
  editor.on('componentregister', (component: MagickComponent<unknown>) => {
    component.worker = (node, _inputs, _outputs, context) => {
      const { context: innerContext, socketOutput } = context as any

      const { sendToPlaytest } = innerContext

      // Might be a bit hacky to do it this way, but it works for now
      if (node.data.sendToPlaytest && sendToPlaytest) {
        // note for later. output is a proety from the output node and that is where it is defined
        sendToPlaytest(socketOutput.output)
      }

      if (socketOutput) {
        return socketOutput
      }
    }
  })
}

const defaultExport = {
  name: 'socketOverridePlugin',
  install,
}

export default defaultExport
