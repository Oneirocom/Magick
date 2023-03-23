import { DataControl } from '../plugins/inspectorPlugin'

export class InputControl extends DataControl {
  constructor({
    dataKey = '',
    name = '',
    icon = 'hand',
    defaultValue,
    placeholder
  }: {
    dataKey: string
    name: string
    icon?: string
    defaultValue?: unknown
    placeholder?: string
  }) {
    super({
      dataKey: dataKey,
      name: name,
      component: 'input',
      defaultValue,
      icon,
      placeholder
    })
  }
}
