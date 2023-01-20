import { IRunContextEditor, MagickComponent } from '../../types'

function install(
  editor: IRunContextEditor
  // Need to better type the feathers client here
) {
  editor.on('componentregister', (component: MagickComponent<unknown>) => {
    component.worker = async (_node, _inputs, _outputs, context) => {
      if (context.socketOutput) {
        return context.socketOutput
      }
    }
  })
}

const defaultExport = {
  name: 'socketOverridePlugin',
  install,
}

export default defaultExport
