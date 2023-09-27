// DOCUMENTED
import Rete from 'shared/rete'
import { InputsData } from 'rete/types/core/data'
import { DataControl } from '../plugins/inspectorPlugin'
import * as sockets from '../sockets'
import { DataSocketType, InputComponentData } from '../types'

/**
 * InputGeneratorControl Class. Inherits DataControl class.
 * Handles the modification of data inputs for a Rete node.
 */
export class InputGeneratorControl extends DataControl {
  socketType: sockets.SocketType
  declare options: {
    dataKey: string
    name: string
    component: string
    icon: string
    data: InputComponentData
  }

  /**
   * Constructor for the InputGeneratorControl class.
   * @param {InputComponentData} param0 - The input component data.
   */
  constructor({
    socketType = 'anySocket',
    taskType = 'output',
    ignored = [],
    icon = 'properties',
  }: InputComponentData) {
    const options = {
      dataKey: 'inputs',
      name: 'Data Inputs',
      component: 'inputGenerator',
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
   * Function to process incoming data.
   * Updates the node's inputs based on the received data.
   * @param {InputsData & DataSocketType[]} inputs - The incoming data to process.
   */
  onData(inputs: InputsData & DataSocketType[]) {
    if (!inputs) return

    if (this.node === null) return console.error('Node is null')
    this.node.data.inputs = inputs

    const existingInputs: string[] = []

    this.node.inputs.forEach(out => {
      existingInputs.push(out.key)
    })

    existingInputs.forEach(key => {
      if (this.node === null) return console.error('Node is null')
      const input = this.node.inputs.get(key)

      this.node
        .getConnections()
        .filter(con => con.input.key === key)
        .forEach(con => {
          if (this.editor === null) return console.error('Editor is null')
          this.editor.removeConnection(con)
        })

      if (input === undefined) return
      this.node.removeInput(input)
    })

    // Any incoming inputs not already on the node are new and will be added.
    const newInputs = inputs.filter(
      input => !existingInputs.includes(input.name)
    )

    // From these new inputs, we iterate and add an input socket to the node
    newInputs.forEach(input => {
      const newInput = new Rete.Input(
        input.name,
        input.name,
        sockets[input.socketType]
      )

      if (this.node === null) return console.error('Node is null')
      this.node.addInput(newInput)
    })

    this.node.update()
  }
}
