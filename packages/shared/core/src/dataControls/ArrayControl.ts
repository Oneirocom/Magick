// DOCUMENTED
/**
 * Represents a data control for an array
 */
import { DataControl } from '../plugins/inspectorPlugin'

export class ArrayControl extends DataControl {
  /**
   * @param {Object} data - The data used to initialize the control
   * @param {string} data.dataKey - The key for the control's data
   * @param {string} data.name - The name of the control
   * @param {string} [data.icon = 'hand'] - The icon of the control
   */
  constructor({ dataKey, name, icon = 'hand', tooltip }) {
    const options = {
      dataKey,
      name,
      component: 'input',
      icon,
      type: 'array',
      tooltip: tooltip,
    }

    super(options)
  }

  /**
   * Returns the data of the control
   * @returns {void}
   */
  override onData() {
    return
  }
}
