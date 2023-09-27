// DOCUMENTED
/**
 * This class represents a boolean control for data manipulation.
 * It extends the DataControl class from the inspectorPlugin module.
 * @extends DataControl
 */
import { DataControl } from '../plugins/inspectorPlugin'

export class BooleanControl extends DataControl {
  /**
   * Creates an instance of BooleanControl.
   * @param {object} config - The configuration object for this control.
   * It should contain the following properties:
   *      @param {string} dataKey - The key of the data the control will manipulate.
   *      @param {string} name - The name of the control to be shown in the inspector UI.
   *      @param {string} icon - The icon of the control to be shown in the inspector UI. Defaults to 'hand'.
   *      @param {string} component - The type of control to be rendered in the inspector UI. Defaults to 'switch'.
   *      @param {string} tooltip   - The type of control to show the quick overview to the users
   *      @param {boolean} defaultValue - The initial value of the controlled data. Defaults to 'false'.
   */
  constructor(config) {
    const options = {
      dataKey: config.dataKey, // Assign the dataKey property from the configuration object.
      name: config.name, // Assign the name property from the configuration object.
      component: config.component || 'switch', // Assign the component property from the configuration object or default to 'switch'.
      icon: config.icon || 'hand', // Assign the icon property from the configuration object or default to 'hand'.
      type: 'boolean', // Set the control type to 'boolean'.
      defaultValue: config.defaultValue || false, // Assign the defaultValue property from the configuration object or default to 'false'.
      tooltip: config.tooltip,
    }

    super(options) // Call the super constructor with the options object.
  }

  /**
   * This function is called when new data is set to the control. It does not perform any action
   * except returning control to the parent component.
   */
  override onData() {
    return
  }
}
