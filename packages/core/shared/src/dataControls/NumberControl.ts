// DOCUMENTED
/**
 * A custom control class for number inputs that extends the DataControl class
 * from the inspectorPlugin module.
 */
import { DataControl } from '../plugins/inspectorPlugin'

export class NumberControl extends DataControl {
  /**
   * Creates an instance of NumberControl.
   *
   * @param {Object} params - An object containing the key, name, icon,
   * defaultValue of the control.
   */
  constructor({ dataKey, name, icon = 'hand', defaultValue = -1, tooltip }) {
    super({
      dataKey: dataKey,
      name: name,
      component: 'input',
      icon,
      type: 'number',
      defaultValue,
      tooltip: tooltip,
    })
  }

  /**
   * Function to be called when data changes.
   *
   * @returns {void}
   */
  override onData() {
    return
  }
}
