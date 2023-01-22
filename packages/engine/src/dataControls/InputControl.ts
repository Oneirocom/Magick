import { DataControl } from '../plugins/inspectorPlugin'

let nonce = 0
export class InputControl extends DataControl {
  constructor({
    dataKey = '',
    name = '',
    icon = 'hand',
    defaultValue,
  }: {
    dataKey: string
    name: string
    icon?: string
    defaultValue?: unknown
  }) {
    super({
      dataKey: dataKey + nonce++,
      name: name,
      component: 'input',
      defaultValue,
      icon,
    })
  }

  onData = () => {
    return
  }
}
