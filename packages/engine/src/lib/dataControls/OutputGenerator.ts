import Rete from 'rete'

import { DataControl } from '../plugins/inspectorPlugin'
// eslint-disable-next-line import/no-namespace
import * as sockets from '../sockets'
import { MagicNodeOutput } from '../types'

export class OutputGeneratorControl extends DataControl {
  socketType: string

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

  onData(outputs: MagicNodeOutput[] = []) {
    if (this.node === null) throw new TypeError('Node is null')
    this.node.data.outputs = outputs

    const existingOutputs: string[] = []
    const ignored =
      this?.control?.data?.ignored?.map(output => output.name) || []

    this.node.outputs.forEach(out => {
      existingOutputs.push(out.key)
    })

    // Any outputs existing on the current node that arent incoming have been deleted
    // and need to be removed.
    existingOutputs
      .filter(existing => !outputs.some(incoming => incoming.name === existing))
      .filter(existing => ignored.some(out => out !== existing))
      .forEach(key => {
        if (this.node === null) throw new TypeError('Node is null')
        const output = this.node.outputs.get(key)
        if (output === undefined) return

        this.node
          .getConnections()
          .filter(con => con.output.key === key)
          .forEach(con => {
            this.editor?.removeConnection(con)
          })

        this.node.removeOutput(output)
        delete this.component?.task.outputs[key]
      })

    // any incoming outputs not already on the node are new and will be added.
    const newOutputs = outputs.filter(
      out => !existingOutputs.includes(out.name)
    )

    // Here we are running over and ensuring that the outputs are in the task
    if (this.component === null)
      throw new TypeError('Component is null')
    this.component.task.outputs = this.node.data.outputs?.reduce(
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
      if (this.node === null) throw new TypeError('Node is null')
      this.node.addOutput(newOutput)
    })

    this.node.update()
  }
}
