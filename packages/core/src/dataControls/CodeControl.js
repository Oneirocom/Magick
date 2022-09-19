import { DataControl } from '../plugins/inspectorPlugin'
export class CodeControl extends DataControl {
  constructor({ dataKey, name, icon = 'feathers' }) {
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

  onData() {
    return
  }
}
