import { IRunContextEditor } from '../../../types'

function install(editor: IRunContextEditor) {
  editor.on('componentregister', (component: any) => {
    component.worker = (node, inputs, _outputs, { magick, socketOutput }) => {
      const { sendToPlaytest } = magick

      // Might be a bit hacky to do it this way, but it works for now
      if (node.data.sendToPlaytest && sendToPlaytest) {
        console.log('OUTPUT')
        const text = inputs.input.filter(Boolean)[0] as string
        sendToPlaytest(text)
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
