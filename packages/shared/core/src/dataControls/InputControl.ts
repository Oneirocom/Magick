// DOCUMENTED
/**
 * A class that extends DataControl and represents an input control.
 *
 * @extends DataControl
 */
import { DataControl } from '../plugins/inspectorPlugin'

export class InputControl extends DataControl {
  /**
   * Creates an instance of InputControl.
   *
   * @param {Object} inputOptions - The options to initialize InputControl with.
   * @param {string} inputOptions.dataKey - The key used to store and retrieve the value controlled by this input.
   * @param {string} inputOptions.name - The name or label associated with the input.
   * @param {string} [inputOptions.icon = 'hand'] - The name of the icon to display with the input.
   * @param {*} [inputOptions.defaultValue] - The default value for the input.
   * @param {string} [inputOptions.placeholder] - The placeholder text for the input.
   *
   * @memberof InputControl
   */
  constructor({
    dataKey = '',
    name = '',
    icon = 'hand',
    tooltip = '',
    defaultValue,
    placeholder,
  }: {
    dataKey: string
    name: string
    icon?: string
    defaultValue?: unknown
    placeholder?: string
    tooltip?: string
  }) {
    // Call super constructor with options and 'input' as the type of control
    super({
      dataKey: dataKey,
      name: name,
      component: 'input',
      defaultValue: defaultValue,
      icon: icon,
      placeholder: placeholder,
      tooltip: tooltip,
    })
  }
}
