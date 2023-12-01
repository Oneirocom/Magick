// DOCUMENTED
/**
 * A class that extends `DataControl` to create a custom control for fewshot data.
 * @extends DataControl
 */
import { DataControl } from '../plugins/inspectorPlugin'

export class FewshotControl extends DataControl {
  /**
   * Creates an instance of FewshotControl.
   * @param {object} options - An object containing settings for the control.
   * @param {string} options.language - The language of the data.
   * @param {string} options.icon - The icon to display for the control.
   * @param {string} options.dataKey - The key to access the data.
   * @param {string} options.name - The name of the control.
   * @param {string} options.defaultValue - The default value for the control.
   */
  constructor({
    language = 'plaintext',
    icon = 'fewshot',
    dataKey = 'fewshot',
    name = 'fewshot',
    defaultValue = '',
    tooltip = '',
  }) {
    const options = {
      dataKey,
      name,
      component: 'longText',
      icon,
      options: {
        editor: true,
        language,
        wordWrap: true,
      },
      defaultValue,
      tooltip: tooltip,
    }

    // Calls the constructor of parent class and passes the options object to it.
    super(options)
  }

  /**
   * Returns data for the control.
   * @returns {void}
   */
  override onData() {
    return
  }
}
