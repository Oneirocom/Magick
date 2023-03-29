/* eslint-disable no-empty */
import { DataControl } from '../plugins/inspectorPlugin'

export class NumberControl extends DataControl {
  constructor({ dataKey, name, icon = 'hand', defaultValue = -1 }) {
    const options = {
      dataKey: dataKey,
      name: name,
      component: 'input',
      icon,
      type: 'number',
      defaultValue,
    }

    super(options)
  }

  onData() {
    return
  }
}
