// DOCUMENTED
import { DataControl } from '../DataControl'

/**
 * InfoControl class is a subclass of DataControl
 * This class is responsible for creating a control option that represents the info component.
 */
export class InfoControl extends DataControl {
  /**
   * Constructor for creating an instance of InfoControl
   * @param dataKey - The key in the source data that this control options represents
   * @param name - The name of the control option
   * @param info - Additional information that will be displayed in the UI
   */
  constructor({
    dataKey,
    name,
    info,
  }: {
    dataKey: string
    name: string
    info: string
  }) {
    const options = {
      dataKey: dataKey,
      name: name,
      component: 'info',
      icon: 'info',
      data: {
        info,
      },
    }
    super(options)
  }
}
