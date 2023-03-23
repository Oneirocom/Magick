import { IRunContextEditor } from '../../types'

function install(editor: IRunContextEditor) {
  editor.on('componentregister', (component: any) => {
    component.worker = (node, _inputs, _outputs, { magick, socketOutput }) => {
      const { sendToPlaytest } = magick

      // Might be a bit hacky to do it this way, but it works for now
      if (node.data.sendToPlaytest && sendToPlaytest) {
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
