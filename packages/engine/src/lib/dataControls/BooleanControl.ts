/* eslint-disable no-empty */
import { DataControl } from '../plugins/inspectorPlugin'

export class BooleanControl extends DataControl {
  constructor({ dataKey, name, icon = 'hand', component = 'switch', defaultValue = false }) {
    const options = {
      dataKey: dataKey,
      name: name,
      component,
      icon,
      type: 'boolean',
      defaultValue,
    }

    super(options)
  }

  onData() {
    return
  }
}
