/**
 * A class that extends DataControl and represents a slider control.
 *
 * @extends DataControl
 */
import { DataControl } from '../plugins/inspectorPlugin'

export class SliderControl extends DataControl {
  constructor({
    dataKey,
    name,
    icon = 'slider',
    defaultValue = 1,
    min = 0,
    max = 100,
    step = 1,
    tooltip = '',
  }: {
    dataKey: string
    name: string
    icon?: string
    defaultValue?: number
    min?: number
    max?: number
    step?: number
    tooltip?: string
  }) {
    super({
      dataKey,
      name,
      component: 'slider',
      defaultValue,
      icon,
      tooltip,
      options: { min, max, step, defaultValue, tooltip },
    })
  }
}
