import { DataControl } from '../plugins/inspectorPlugin'

export class SwitchControl extends DataControl {
  constructor({
    dataKey,
    name,
    icon = 'hand',
    label = 'Toggle',
    defaultValue = {},
  }: {
    dataKey: string
    name: string
    icon?: string
    label: string
    defaultValue?: unknown
  }) {
    super({
      dataKey: dataKey,
      defaultValue,
      name,
      component: 'switch',
      icon,
      data: {
        label,
      },
    })
  }

  onData = () => {
    return
  }
}
