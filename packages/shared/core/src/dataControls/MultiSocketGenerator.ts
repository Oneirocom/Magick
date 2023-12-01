// DOCUMENTED
import { DataControl } from '../plugins/inspectorPlugin'

/**
 * MultiSocketGeneratorControl is a DataControl that allows you to socket groups
 * So one (+) can create multiple sockets at once.
 */
export class MultiSocketGeneratorControl extends DataControl {
  /**
   * Type of connection.
   */
  connectionType: string

  /**
   * Creates an instance of MultiSocketGeneratorControl.
   *
   * @param {string[]} socketTypes - Array of socket types.
   * @param {string[]} taskTypes - Array of task types.
   * @param {Object[]} [ignored=[]] - Array of ignored names of the group.
   * @param {string} [icon='properties'] - Icon data.
   * @param {('input' | 'output')} connectionType - Group type.
   * @param {string} name - Name of the control.
   */
  constructor({
    socketTypes,
    taskTypes,
    ignored = [],
    icon = 'properties',
    connectionType,
    name: nameInput,
    tooltip = '',
  }: {
    socketTypes: string[]
    taskTypes: string[]
    ignored?: { name: string }[]
    icon?: string
    connectionType: 'input' | 'output'
    name: string
    tooltip?: string
  }) {
    const name = nameInput || `${socketTypes.join('|')} ${connectionType}s`

    const options = {
      dataKey: connectionType + 's',
      name,
      component: 'multiSocketGenerator',
      icon,
      data: {
        ignored,
        socketTypes,
        taskTypes,
        connectionType,
      },
      tooltip: tooltip,
    }

    super(options)

    this.connectionType = connectionType
  }
}
