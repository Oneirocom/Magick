import { DataControl } from '../plugins/inspectorPlugin'
export class CodeControl extends DataControl {
  constructor({ dataKey, name, icon = 'feathers', language }) {
    const options = {
      dataKey: dataKey,
      name: name,
      component: 'code',
      icon,
      options: {
        editor: true,
        language: language,
      },
    }

    super(options)
  }

  onData() {
    return
  }
}
