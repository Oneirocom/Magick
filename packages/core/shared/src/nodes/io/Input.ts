// DOCUMENTED
import { isEmpty } from 'lodash'
import Rete from 'rete'
import { v4 as uuidv4 } from 'uuid'

import { DropdownControl } from '../../dataControls/DropdownControl'
import { InputControl } from '../../dataControls/InputControl'
import { SwitchControl } from '../../dataControls/SwitchControl'
import { MagickComponent } from '../../engine'
import { PluginIOType, pluginManager } from '../../plugin'
import { DataControl } from '../../plugins/inspectorPlugin'
import { anySocket, triggerSocket } from '../../sockets'
import {
  CompletionSocket,
  MagickNode,
  MagickTask,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData,
} from '../../types'

/** Information about the InputComponent functionality */
const info = `The input component allows you to pass a single value to your graph.  You can set a default value to fall back to if no value is provided at runtime.  You can also turn the input on to receive data from the playtest input.`

type InputReturn = {
  output: unknown
}

/**
 * InputComponent is a MagickComponent that handles user input
 */
export class InputComponent extends MagickComponent<InputReturn> {
  nodeTaskMap: Record<number, MagickTask> = {}

  constructor() {
    // Name of the component
    super(
      'Input',
      {
        outputs: {
          output: 'output',
          trigger: 'option',
        },
      },
      'I/O',
      info
    )

    this.module = {
      nodeType: 'input',
      socket: anySocket,
    }

    this.contextMenuName = 'Input'
    this.displayName = 'Input'
  }

  /**
   * Builder function for configuring the input component and adding controls to the node
   *
   * @param {MagickNode} node - The node being built
   * @returns {MagickNode} - The configured node
   */
  builder(node: MagickNode) {
    if (node.data.useData === undefined) {
      node.data.useData = true
    }
    // Setup dynamic controls
    const inputName = {
      type: InputControl,
      dataKey: 'inputName',
      name: 'Input Name',
      icon: 'moon',
      defaultValue: 'Default',
      onData: data => {
        node.data.name = `Input - ${data}`
      },
    }

    const useData = {
      type: SwitchControl,
      name: 'Use Data',
      label: 'Use Data',
      dataKey: 'useData',
      defaultValue: node.data.useData,
      onData: data => {
        configureNode()
      },
    }

    const dataOutput = {
      socket: 'output',
      name: 'output',
      type: anySocket,
    }

    const triggerOutput = {
      socket: 'trigger',
      name: 'trigger',
      type: triggerSocket,
    }

    const defaultInputTypes = [
      {
        name: 'Default',
        inspectorControls: [inputName, useData],
        sockets: [],
      },
      {
        name: 'Task',
        inspectorControls: [],
        sockets: [triggerOutput, dataOutput],
      },
    ] as PluginIOType[]

    // Combine default input types with plugin input types
    const inputTypes = [...defaultInputTypes, ...pluginManager.getInputTypes()]

    // Set isInput to true so we can identify this node as an input node
    node.data.isInput = true

    // Each node should have a unique socket key
    node.data.socketKey = node?.data?.socketKey || uuidv4()

    // Set the default name if there is none
    if (!node.data.name) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      node.data.name ?? `Input - ${inputTypes[0].name}`
    }

    // Setup default controls
    const inputType = new DropdownControl({
      name: 'Input Type',
      dataKey: 'inputType',
      values: inputTypes.map(v => v.name),
      defaultValue: inputTypes[0].name,
    })

    node.inspector.add(inputType)

    //
    let lastInspectorControls: any[] | undefined = []
    let lastSockets: CompletionSocket[] | undefined = []

    const handleSockets = sockets => {
      const connections = node.getConnections()
      if (sockets !== lastSockets) {
        lastSockets?.forEach(socket => {
          if (node.outputs.has(socket.socket)) {
            if (socket.socket === 'trigger') return
            connections.forEach(c => {
              if (c.output.key === socket.socket) {
                this.editor?.removeConnection(c)
              }
            })
            node.outputs.delete(socket.socket)
          }
        })
        sockets.forEach(socket => {
          if (node.outputs.has(socket.socket)) return
          if (node.data.inputType === 'Default') {
            if (socket.socket === 'trigger') return
            // if socket is output and useData is false, don't add
            if (socket.socket === 'output' && node.data.useData !== true) return
          }
          node.addOutput(
            new Rete.Output(socket.socket, socket.name, socket.type)
          )
        })

        lastSockets = sockets
      }
    }

    const configureNode = () => {
      const inputType = node.data.inputType ?? ('Default' as string)

      const connections = node.getConnections()

      const inputTypeData = inputTypes.find(v => v.name === inputType) ?? {
        inspectorControls: [],
        sockets: [],
      }

      const inspectorControls = inputTypeData.inspectorControls ?? []
      const sockets = inputTypeData.sockets ?? []

      // configure default
      if (inputType === 'Default') {
        sockets.push(triggerOutput)
      }

      if (inputType === 'Default' && node.data.useData === true) {
        sockets.push(dataOutput)
      }

      if (inputType !== 'Default') {
        node.data.name = `Input - ${inputType}`
      } else {
        node.data.name = `Input - ${node.data.inputName}`
        if (!node.outputs.has('trigger')) {
          node.addOutput(new Rete.Output('trigger', 'trigger', triggerSocket))
        }
        if (!node.data.useData && node.outputs.has('output')) {
          connections.forEach(c => {
            if (c.output.key === 'output') {
              this.editor?.removeConnection(c)
            }
          })
          node.outputs.delete('output')
        } else if (node.data.useData === true && !node.outputs.has('output')) {
          node.addOutput(new Rete.Output('output', 'output', anySocket))
        }
      }

      if (inspectorControls !== lastInspectorControls) {
        lastInspectorControls?.forEach((control: DataControl) => {
          node.inspector.dataControls.delete(control.dataKey)
        })
        inspectorControls.forEach(control => {
          const _control = new control.type({
            ...control,
            defaultValue: node.data[control.dataKey] || control.defaultValue,
          })
          _control.onData = control.onData
          node.inspector.add(_control)
        })
        lastInspectorControls = inspectorControls
      }

      handleSockets(sockets)

      const context = this.editor && this.editor.context
      if (!context) return
      const { sendToInspector } = context
      if (sendToInspector) {
        sendToInspector(node.inspector.data())
      }
    }

    inputType.onData = data => {
      configureNode()
    }

    // Prevent accidentally setting to 'Input - Input -'
    inputType.onData(node.data.name?.replace('Input - ', ''))

    // Configure node when builder is called
    configureNode()
    return node
  }

  worker(
    node: WorkerData,
    _inputs: MagickWorkerInputs,
    outputs: MagickWorkerOutputs,
    { data }: { data: string | undefined }
  ) {
    node.data.isInput = true
    // handle data subscription.  If there is data, this is from playtest
    if (data && !isEmpty(data)) {
      this._task.closed = []

      const output = Object.values(data)[0] as string

      return {
        output,
      }
    }

    this._task.closed = ['trigger']

    if (Object.values(outputs.output).length > 0) {
      return { output: Object.values(outputs)[0] }
    }

    // If there are outputs, we are running as a module input and we use that value
    if (outputs.output && !outputs?.output.task) {
      return outputs as { output: unknown }
    }

    // fallback to default value at the end
    return {
      output: node.data.defaultValue as string,
    }
  }
}
