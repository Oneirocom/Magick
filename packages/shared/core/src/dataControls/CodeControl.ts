// DOCUMENTED
/**
 * A subclass of DataControl that represents a control for editing code.
 */
import { DataControl } from '../plugins/inspectorPlugin'

export class CodeControl extends DataControl {
  /**
   * Creates a new CodeControl instance.
   * @param dataKey The key of the data property this control is associated with.
   * @param name The name of the control.
   * @param icon The icon to display for the control.
   * @param language The default language of the code editor.
   */
  constructor({
    dataKey,
    name,
    icon = 'feathers',
    language = 'javascript',
    tooltip = '',
  }: {
    dataKey: string
    name: string
    icon?: string
    language?: string
    tooltip?: string
  }) {
    const options = {
      dataKey,
      name,
      component: 'code',
      icon,
      options: {
        editor: true,
        language,
      },
      tooltip: tooltip,
    }

    super(options)
  }

  /**
   * Returns the current data of the control.
   * Since this is a CodeControl, it doesn't really handle data.
   * @return Always returns undefined.
   */
  override onData() {
    return undefined
  }
}
