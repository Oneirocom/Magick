import Rete from 'rete'

import { DataControl } from '../plugins/inspectorPlugin'
// eslint-disable-next-line import/no-namespace
import * as sockets from '../sockets'

export class OutputGeneratorControl extends DataControl {
  constructor({
    socketType = 'anySocket',
    taskType = 'output',
    ignored = [],
    icon = 'properties',
  }) {
    const options = {
      dataKey: 'outputs',
      name: 'Data Outputs',
      component: 'outputGenerator',
      icon,
      data: {
        ignored,
        socketType,
        taskType,
      },
    }

    super(options)
    this.socketType = socketType
  }

  onData(outputs = []) {
    this.node.data.outputs = outputs

    const existingOutputs = []
    const ignored =
      this?.control?.data?.ignored.map(output => output.name) || []

    this.node.outputs.forEach(out => {
      existingOutputs.push(out.key)
    })

    // Any outputs existing on the current node that arent incoming have been deleted
    // and need to be removed.
    existingOutputs
      .filter(existing => !outputs.some(incoming => incoming.name === existing))
      .filter(existing => ignored.some(out => out !== existing))
      .forEach(key => {
        const output = this.node.outputs.get(key)

        this.node
          .getConnections()
          .filter(con => con.output.key === key)
          .forEach(con => {
            this.editor.removeConnection(con)
          })

        this.node.removeOutput(output)
        delete this.component.task.outputs[key]
      })

    // any incoming outputs not already on the node are new and will be added.
    const newOutputs = outputs.filter(
      out => !existingOutputs.includes(out.name)
    )

    // Here we are running over and ensuring that the outputs are in the task
    this.component.task.outputs = this.node.data.outputs.reduce(
      (acc, out) => {
        acc[out.name] = out.taskType || 'output'
        return acc
      },
      { ...this.component.task.outputs }
    )

    // From these new outputs, we iterate and add an output socket to the node
    newOutputs.forEach(output => {
      const newOutput = new Rete.Output(
        output.name,
        output.name,
        sockets[output.socketType]
      )
      this.node.addOutput(newOutput)
    })

    this.node.update()
  }
}
