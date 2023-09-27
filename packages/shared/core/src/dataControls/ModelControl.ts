// DOCUMENTED
/**
 * Represents a control used for selecting a model and its corresponding data.
 * Inherits from the DataControl class.
 */
import { DataControl } from '../plugins/inspectorPlugin'

export class ModelControl extends DataControl {
  /**
   * Constructor for creating a new ModelControl instance.
   * @param name - The name of the control
   * @param dataKey - The key where the selected data should be stored
   * @param defaultValue - The default value for the data
   * @param icon - The icon to use for the control (default is 'properties')
   * @param write - Whether or not the control is writeable (default is true)
   */
  constructor({
    name,
    dataKey,
    defaultValue,
    icon = 'properties',
    write = true,
    tooltip = '',
  }: {
    name: string
    dataKey: string
    defaultValue: string
    icon?: string
    write?: boolean
    tooltip?: string
  }) {
    const options = {
      dataKey,
      name,
      component: 'modelSelect',
      write,
      icon,
      data: {
        defaultValue,
      },
      tooltip: tooltip,
    }

    super(options)
  }
}
