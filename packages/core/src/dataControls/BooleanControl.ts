/* eslint-disable no-empty */
import { DataControl } from '../plugins/inspectorPlugin'

type ControlArgs = {
  dataKey: string
  name: string
  icon?: string
}

export class BooleanControl extends DataControl {
  constructor({ dataKey, name, icon = 'hand' }: ControlArgs) {
    const options = {
      dataKey: dataKey,
      name: name,
      component: 'input',
      icon,
      type: 'boolean',
    }

    super(options)
  }
}
