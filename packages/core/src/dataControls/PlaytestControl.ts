import { DataControl } from '../plugins/inspectorPlugin'

type ControlArgs = {
  dataKey: string
  name: string
  icon?: string
  label?: string
  defaultValue?: Record<string, unknown>
  ignored?: string[]
}

export class PlaytestControl extends DataControl {
  constructor({
    dataKey,
    name,
    icon = 'hand',
    label = 'Toggle',
    defaultValue = {},
    ignored = [],
  }: ControlArgs) {
    const options = {
      dataKey: dataKey,
      defaultValue,
      name,
      component: 'playtest',
      icon,
      data: {
        label,
        ignored,
      },
    }

    super(options)
  }
}
