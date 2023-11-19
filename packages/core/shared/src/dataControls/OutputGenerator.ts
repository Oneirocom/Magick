// DOCUMENTED
import Rete, { OutputsData } from '@magickml/rete'

import { DataControl } from '../plugins/inspectorPlugin'
import { SocketType } from '../sockets'
import * as sockets from '../sockets'
import { DataSocketType, OutputComponentData, AsDataSocket } from '../types'

/**
 * OutputGeneratorControl class is used to generate data output controls
 */
export class OutputGeneratorControl extends DataControl {
  socketType: SocketType
  declare options: {
    dataKey: string
    name: string
    component: string
    icon: string
    data: OutputComponentData
  }

  /**
   * Constructor for OutputGeneratorControl class
   * @param {OutputComponentData} options - OutputComponentData object
   */
  constructor({
    socketType = 'anySocket',
    taskType = 'output',
    ignored = [],
    icon = 'properties',
  }: OutputComponentData) {
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

  /**
   * onData function handles the outputs on Node data
   * @param {OutputsData & DataSocketType[] | undefined} outputs
   */
  onData(
    outputs: OutputsData & DataSocketType[] = [] as unknown as OutputsData &
      DataSocketType[]
  ) {
    if (this.node === null) return console.error('Node is null')
    this.node.data.outputs = outputs

    const existingOutputs: string[] = []
    const ignored: string[] =
      this?.control?.data?.ignored?.map(output => output.name) || []

    this.node.outputs.forEach(out => {
      existingOutputs.push(out.key)
    })

    // Remove disconnected outputs
    existingOutputs
      .filter(existing => !outputs.some(incoming => incoming.name === existing))
      .filter(existing => ignored.some(out => out !== existing))
      .forEach(key => {
        if (this.node === null) return console.error('Node is null')
        const output = this.node.outputs.get(key)

        this.node
          .getConnections()
          .filter(con => con.output.key === key)
          .forEach(con => {
            this.editor?.removeConnection(con)
          })

        if (output === undefined) return console.error('Output is undefined')
        this.node.removeOutput(output)
        delete this.component?.task.outputs[key]
      })

    // Add new outputs
    const newOutputs = outputs.filter(
      out => !existingOutputs.includes(out.name)
    )

    // Ensure outputs are in the task
    if (this.component === null) return console.error('Component is null')
    this.component.task.outputs = AsDataSocket(this.node.data.outputs)?.reduce(
      (acc, out) => {
        acc[out.name] = out.taskType || 'output'
        return acc
      },
      { ...this.component.task.outputs }
    )

    // Add output sockets to the node
    newOutputs.forEach(output => {
      const newOutput = new Rete.Output(
        output.name,
        output.name,
        sockets[output.socketType]
      )
      if (this.node === null) return console.error('Node is null')
      this.node.addOutput(newOutput)
    })

    this.node.update()
  }
}
