// DOCUMENTED
/**
 * Represents a subclass of DataControl that is specific to controlling playtest functionality.
 * @extends DataControl
 */
import { DataControl } from '../plugins/inspectorPlugin'

export class PlaytestControl extends DataControl {
  /**
   * Creates a new instance of PlaytestControl
   * @param {Object} - An object containing the properties of the PlaytestControl instance.
   * @param {string} dataKey - The key associated with the PlaytestControl's data.
   * @param {string} name - The name of the PlaytestControl.
   * @param {string} [icon=hand] - The icon to be displayed for the PlaytestControl.
   * @param {string} [label=Toggle] - The label displayed for the PlaytestControl.
   * @param {Object} [defaultValue={}] - The default value for the PlaytestControl.
   * @param {Array} [ignored=[]] - An array of elements to be ignored.
   */
  constructor({
    dataKey,
    name,
    icon = 'hand',
    label = 'Toggle',
    defaultValue = {},
    ignored = [],
    tooltip = '',
  }) {
    const options = {
      dataKey, // shorthand object property assignment
      defaultValue,
      name,
      component: 'playtest',
      icon,
      data: {
        label,
        ignored,
      },
      tooltip: tooltip,
    }

    super(options) // call super constructor
  }

  /**
   * Callback that is executed when playtest data changes.
   * @param {any} playtestToggle - The current playtest toggle status.
   */
  onData(playtestToggle) {
    return // No-op, as this method is incomplete
  }
}
