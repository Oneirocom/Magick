import { DataControl } from '../plugins/inspectorPlugin'

type ControlArgs = {
  dataKey: string
  name: string
  icon?: string
}

export class WysiwygControl extends DataControl {
  constructor({ dataKey, name, icon = 'feathers' }: ControlArgs) {
    const options = {
      dataKey: dataKey,
      name: name,
      component: 'wysiwyg',
      icon,
      options: {
        editor: true,
        language: 'test',
      },
    }

    super(options)
  }

  onData() {
    return
  }
}
