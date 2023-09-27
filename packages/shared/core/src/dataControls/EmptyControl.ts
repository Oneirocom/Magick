// DOCUMENTED
/**
 * EmptyControl represents a DataControl that does not present any value.
 * It inherits from DataControl.
 */
import { DataControl } from '../plugins/inspectorPlugin'

export class EmptyControl extends DataControl {
  /**
   * Constructor method for EmptyControl.
   *
   * @param {string} dataKey - The key of the data that the control will interact with.
   * @param {array} ignored - The list of ignored values by the control.
   */
  constructor({ dataKey, ignored = [], tooltip }) {
    const options = {
      dataKey: dataKey,
      name: 'empty',
      component: 'none',
      data: {
        ignored,
      },
      tooltip: tooltip,
    }

    super(options)
  }

  /**
   * onData method simply returns nothing.
   * It overrides its parent onData method.
   */
  override onData() {
    return
  }
}
