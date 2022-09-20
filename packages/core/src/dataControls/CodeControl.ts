import { DataControl } from '../plugins/inspectorPlugin'

type ControlArgs = {
  dataKey: string
  name: string
  icon?: string
}

export class CodeControl extends DataControl {
  constructor({ dataKey, name, icon = 'feathers' }: ControlArgs) {
    const options = {
      dataKey: dataKey,
      name: name,
      component: 'code',
      icon,
      options: {
        editor: true,
        language: 'javascript',
      },
    }

    super(options)
  }
}
