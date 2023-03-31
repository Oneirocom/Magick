// DOCUMENTED 

/**
 * Represents a switch control.
 * @class
 * @extends DataControl
 */
import { DataControl } from '../plugins/inspectorPlugin'

export class SwitchControl extends DataControl {

  /**
   * Creates an instance of SwitchControl.
   * @param {{
   *     dataKey: string,
   *     name: string,
   *     icon?: string,
   *     label: string,
   *     defaultValue?: unknown
   *   }} {
   *     dataKey,
   *     name,
   *     icon = 'hand',
   *     label = 'Toggle',
   *     defaultValue = {},
   *   }
   * @memberof SwitchControl
   */
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

  /**
   * The event handler for data.
   * @memberof SwitchControl
   */
  onData = () => {
    return
  }
}