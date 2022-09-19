import { DataControl } from '../plugins/inspectorPlugin'
export class EnkiThroughputControl extends DataControl {
  constructor({
    socketType = 'String',
    taskType = 'output',
    nodeId,
    icon = 'bird',
  }) {
    const options = {
      dataKey: `throughputs-${nodeId}`,
      name: 'Enki Task Details',
      icon,
      component: 'enkiSelect',
      data: {
        activetask: {},
        socketType,
        taskType,
      },
    }

    super(options)
    this.socketType = socketType
  }

  onData({ activeTask }) {
    // These are already in the node.data from the Inspector running.  It does this for you by default, spacing it on under the output name
    this.node.data.name = activeTask?.taskName || 'Enki Task'
    this.node.data.activetask = activeTask
    this.node.update()
  }
}
