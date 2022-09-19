import { DataControl } from '../plugins/inspectorPlugin'

export class InputControl extends DataControl {
  constructor({ dataKey, name, icon = 'hand', defaultValue = '' }) {
    const options = {
      dataKey: dataKey,
      name: name,
      component: 'input',
      icon,
      type: 'string',
      defaultValue: defaultValue,
    }

    super(options)
  }

  onData() {
    return
  }
}
