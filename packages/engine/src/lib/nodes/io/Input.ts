import { isEmpty } from 'lodash'
import Rete from 'rete'
import { v4 as uuidv4 } from 'uuid'

import { DropdownControl } from '../../dataControls/DropdownControl'
import { InputControl } from '../../dataControls/InputControl'
import { SwitchControl } from '../../dataControls/SwitchControl'
import { TextInputControl } from '../../dataControls/TextInputControl'
import { MagickComponent } from '../../engine'
import { pluginManager } from '../../plugin'
import { anySocket, triggerSocket } from '../../sockets'
import {
  MagickNode,
  MagickTask,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData,
} from '../../types'
const info = `The input component allows you to pass a single value to your graph.  You can set a default value to fall back to if no value is provided at runtime.  You can also turn the input on to receive data from the playtest input.`

type InputReturn = {
  output: unknown
}

const defaultInputTypes = [
  { name: 'Default', trigger: true, socket: anySocket },
  { name: 'Custom', trigger: true, socket: anySocket }, // TODO: is anySocket the right socket for custom?
]

export class InputComponent extends MagickComponent<InputReturn> {
  nodeTaskMap: Record<number, MagickTask> = {}

  constructor() {
    // Name of the component
    super('Input', {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }, 'I/O', info)

    this.module = {
      nodeType: 'input',
      socket: anySocket,
    }

    this.display = true
    this.contextMenuName = 'Input'
    this.displayName = 'Input'
  }

  builder(node: MagickNode) {
    const values = [...defaultInputTypes, ...pluginManager.getInputTypes()]
    const trigger = new Rete.Output('trigger', 'trigger', triggerSocket)
    const out = new Rete.Output('output', 'output', values[0].socket)
    node.data.isInput = true
    node.data.name = node.data.name ?? `Input - ${values[0].name}`

    node.addOutput(trigger).addOutput(out)

    const inputType = new DropdownControl({
      name: 'Input Type',
      dataKey: 'inputType',
      values: values.map(v => v.name),
      defaultValue: values[0].name,
    })

    node.inspector.add(inputType)

    let lastSockets: any[] | undefined = []
    let lastInspectorControls: any[] | undefined = []

    const configureNode = () => {
      const inputType = node.data.inputType as string
      const isCustom = inputType === 'Custom'
      
      const connections = node.getConnections()

      const inspectorControls: any[] = []

      if(isCustom){
        const inputName = new InputControl({
          name: 'Input Name',
          dataKey: 'inputName',
          defaultValue: 'Custom',
        })

        inputName.onData = data => {
          node.data.name = `Input - ${data}`
        }

        inspectorControls.push(inputName)
        node.inspector.add(inputName)
        
        const useTrigger = new SwitchControl({
          name: 'Use Trigger',
          label: 'Use Trigger',
          dataKey: 'useTrigger',
          defaultValue: true,
        })

        inspectorControls.push(useTrigger)
        node.inspector.add(useTrigger)
      }
  
      if (inspectorControls !== lastInspectorControls) {
        lastInspectorControls?.forEach(control => {
          node.inspector.dataControls.delete(control.dataKey)
        })
        inspectorControls?.forEach(control => {
          const _control = new control.type(control)
          node.inspector.add(_control)
        })
        lastInspectorControls = inspectorControls
      }

      // if (sockets !== lastSockets) {
      //   lastSockets?.forEach(socket => {
      //     if (node.outputs.has(socket.socket)) node.outputs.delete(socket.socket)
      //   })
      //   sockets.forEach(socket => {
      //     node.addOutput(new Rete.Output(socket.socket, socket.name, socket.type))
      //   })
      //   lastSockets = sockets
      // }
    }

    // const createInput = () => {
    //   console.log('createInput')

    //   node.inspector.add(inputName)
    //   console.log(node.inspector.dataControls.get('inputName'))
    //   node.data.name = `Input - ${node.data.inputName}`
    // }

    inputType.onData = data => {
      console.log('inputType.onData', data)
      if (data === 'Custom') {
        console.log(node.inspector.dataControls.get('inputName'))
        // if inputName is not added to the node, add it
        if (!node.inspector.dataControls.get('inputName')) {
          // createInput()
        }
        return
      }
      console.log('maybe destroy inputName')
      console.log(node.inspector.dataControls.get('inputName'))
      if(node.inspector.dataControls.get('inputName'))
        node.inspector.dataControls.delete('inputName')
      node.data.name = `Input - ${data}`
    }

    inputType.onData(node.data.name.replace('Input - ', ''))

    const toggleDefault = new SwitchControl({
      dataKey: 'useDefault',
      name: 'Use Default',
      label: 'Use Default',
      defaultValue: false,
    })

    const defaultInput = new InputControl({
      dataKey: 'defaultValue',
      name: 'Default Input',
      defaultValue: node?.data?.defaultValue || 'Hello world',
    })

    if(node.data.inputType === 'Custom') {
      // createInput()
    }

    node.inspector
      .add(toggleDefault)
      .add(defaultInput)

    // module components need to have a socket key.
    // todo add this somewhere automated? Maybe wrap the modules builder in the plugin
    node.data.socketKey = node?.data?.socketKey || uuidv4()

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
    if (
      data &&
      !isEmpty(data) /* && node.data.playtestToggle.receivePlaytest*/
    ) {
      this._task.closed = []

      const output = Object.values(data)[0] as string

      return {
        output,
      }
    }

    this._task.closed = ['trigger']

    // send default value if 'use default' is explicity toggled on
    if (node.data.useDefault) {
      return {
        output: node.data.defaultValue as string,
      }
    }

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
