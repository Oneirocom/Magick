// DOCUMENTED
/**
 * Represents a dropdown control that extends from DataControl.
 *
 * @extends DataControl
 */
import { DataControl } from '../plugins/inspectorPlugin'

export class DropdownControl extends DataControl {
  /**
   * Creates an instance of DropdownControl.
   *
   * @param {Object} options - An object containing various options for the dropdown control.
   * @param {string} options.name - The name of the dropdown control.
   * @param {string} options.dataKey - The datakey for the dropdown control.
   * @param {string[]} options.values - The array of values for the dropdown control.
   * @param {string} options.defaultValue - The default value for the dropdown control.
   * @param {string} [options.icon='properties'] - The icon for the dropdown control.
   * @param {boolean} [options.write=true] - Specifies whether the dropdown control can be written to or not.
   * @param {string[]} [options.ignored=[]] - An array of ignored items for the dropdown control.
   */
  constructor({
    name,
    dataKey,
    values,
    defaultValue,
    icon = 'properties',
    write = true,
    ignored = [],
    tooltip = '',
  }: {
    name: string
    dataKey: string
    defaultValue: string
    values: string[]
    icon?: string
    write?: boolean
    ignored?: string[]
    tooltip?: string
  }) {
    const options = {
      dataKey,
      name,
      component: 'dropdownSelect',
      write,
      icon,
      data: {
        defaultValue,
        values,
        ignored,
      },
      tooltip: tooltip,
    }

    super(options)
  }
}
