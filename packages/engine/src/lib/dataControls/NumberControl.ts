/* eslint-disable no-empty */
import { DataControl } from '../plugins/inspectorPlugin'

export class NumberControl extends DataControl {
  constructor({ dataKey, name, icon = 'hand' }) {
    const options = {
      dataKey: dataKey,
      name: name,
      component: 'input',
      icon,
      type: 'number',
    }

    super(options)
  }

  onData() {
    return
  }
}
