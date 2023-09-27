// DOCUMENTED
/**
 * This class represents a SocketGeneratorControl, which extends DataControl
 * and generates a socket based on the input of the user.
 *
 * @class SocketGeneratorControl
 * @extends DataControl
 */
import { DataControl } from '../plugins/inspectorPlugin'
import { SocketType } from '../sockets'
import { IgnoredList, TaskType } from '../types'

export class SocketGeneratorControl extends DataControl {
  connectionType: string

  /**
   * Create a new instance of SocketGeneratorControl.
   *
   * @param {Object} options - The options needed to generate the socket control.
   * @param {SocketType} [options.socketType='anySocket'] - The socket type of the socket generated.
   * @param {TaskType} [options.taskType='output'] - The task type of the socket generated.
   * @param {IgnoredList} [options.ignored=[]] - A list of items to be ignored.
   * @param {string} [options.icon='properties'] - The icon for the SocketGeneratorControl.
   * @param {string} options.connectionType - The type of the connection of the socket generated. Can be 'input' or 'output'.
   * @param {string} options.name - The name of the socket generated.
   */
  constructor({
    socketType = 'anySocket',
    taskType = 'output',
    ignored = [],
    icon = 'properties',
    connectionType,
    name: nameInput,
    tooltip = '',
  }: {
    socketType?: SocketType
    taskType?: TaskType
    ignored?: IgnoredList
    icon?: string
    connectionType: 'input' | 'output'
    name: string
    tooltip?: string
  }) {
    super({
      dataKey: connectionType + 's',
      name: nameInput || `Socket ${connectionType}s`,
      component: 'socketGenerator',
      icon,
      data: {
        ignored,
        socketType,
        taskType,
        connectionType,
      },
      tooltip: tooltip,
    })

    if (
      !connectionType ||
      !(connectionType === 'input' || connectionType === 'output')
    ) {
      throw new Error(
        "connectionType of your generator must be defined and of the value 'input' or 'output'."
      )
    }

    this.connectionType = connectionType
  }
}
