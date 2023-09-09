import { IRunContextEditor, MagickNode } from '../../types'
import { MagickComponent } from '../../engine'
import { SwitchControl } from '../../dataControls/SwitchControl'

function install(editor: IRunContextEditor) {
  editor.on('componentregister', (component: MagickComponent<unknown>) => {
    const builder = component.builder

    // we are going to override the default builder with our own, and will invoke the original builder inside it.
    component.builder = (node: MagickNode) => {
      const switchControl = new SwitchControl({
        dataKey: 'log',
        name: 'Log',
        icon: 'bug',
        label: 'Log',
        defaultValue: false,
      })

      node.inspector.add(switchControl)

      builder.call(component, node)
    }
  })
}

const defaultExport = {
  name: 'debuggerPlugin',
  install,
}

export default defaultExport
