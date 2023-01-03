/* eslint-disable no-empty */
import { DataControl } from '../plugins/inspectorPlugin'

export class BooleanControl extends DataControl {
  constructor({ dataKey, name, icon = 'hand' }) {
    const options = {
      dataKey: dataKey,
      name: name,
      component: 'input',
      icon,
      type: 'boolean',
    }

    super(options)
  }

  onData() {
    return
  }
}
