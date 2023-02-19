import { DataControl } from '../plugins/inspectorPlugin'

// MultiSocketGeneratorControl is a DataControl that allows you to socket groups
// So one (+) can create multiple sockets at once.
export class MultiSocketGeneratorControl extends DataControl {
  connectionType: string
  constructor({
    socketTypes,
    taskTypes,
    ignored = [],
    icon = 'properties',
    connectionType,
    name: nameInput,
  }: {
    socketTypes: string[]
    taskTypes: string[]
    ignored?: string[]
    icon?: string
    connectionType: 'input' | 'output'
    name: string
  }) {
    if (
      !connectionType ||
      (connectionType !== 'input' && connectionType !== 'output')
    )
      throw new Error(
        "connectionType of your generator must be defined and of the value 'input' or 'output'."
      )

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
    }

    super(options)

    this.connectionType = connectionType
  }
}
