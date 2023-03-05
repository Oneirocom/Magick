import { isEmpty } from 'lodash'
import Rete from 'rete'
import { v4 as uuidv4 } from 'uuid'

import {
  EditorContext,
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
} from '../../types'
import { DropdownControl } from '../../dataControls/DropdownControl'
import { pluginManager } from '../../plugin'
import { InputControl } from '../../dataControls/InputControl'
import { PlaytestControl } from '../../dataControls/PlaytestControl'
import { SwitchControl } from '../../dataControls/SwitchControl'
import { anySocket, eventSocket, triggerSocket } from '../../sockets'
import { MagickComponent, MagickTask } from '../../magick-component'
const info = `The input component allows you to pass a single value to your graph.  You can set a default value to fall back to if no value is provided at runtime.  You can also turn the input on to receive data from the playtest input.`

type InputReturn = {
  output: unknown
}

const defaultInputTypes = [
  { name: 'Default', trigger: true, socket: anySocket },
]

export class InputComponent extends MagickComponent<InputReturn> {
  nodeTaskMap: Record<number, MagickTask> = {}

  constructor() {
    // Name of the component
    super('Input')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }

    this.module = {
      nodeType: 'input',
      socket: anySocket,
    }

    this.category = 'I/O'
    this.info = info
    this.display = true
    this.contextMenuName = 'Input'
    this.displayName = 'Input'
  }

  subscriptionMap: Record<string, Function> = {}

  unsubscribe?: () => void

  subscribeToPlaytest(node: MagickNode) {
    const { onPlaytest } = this.editor?.magick as EditorContext

    // check node for the right data attribute
    if (onPlaytest) {
      // store the unsubscribe function in our node map
      this.subscriptionMap[node.id] = onPlaytest((text: string) => {
        // if the node doesnt have playtest toggled on, do nothing
        // const playtestToggle = node.data.playtestToggle as unknown as {
        //   receivePlaytest: boolean
        // }

        // if (!playtestToggle.receivePlaytest) return

        // attach the text to the nodes data for access in worker
        node.data.text = text
      })
    }
  }

  destroyed(node: MagickNode) {
    if (this.subscriptionMap[node.id]) this.subscriptionMap[node.id]()
    delete this.subscriptionMap[node.id]
  }

  builder(node: MagickNode) {
    if (this.subscriptionMap[node.id]) this.subscriptionMap[node.id]()
    delete this.subscriptionMap[node.id]

    const values = [...defaultInputTypes, ...pluginManager.getInputTypes()]
    const trigger = new Rete.Output('trigger', 'trigger', triggerSocket)
    const out = new Rete.Output('output', 'output', values[0].socket)
    node.data.isInput = true;
    node.data.name = node.data.name ?? `Input - ${values[0].name}`

    node.addOutput(trigger).addOutput(out)

    const inputType = new DropdownControl({
      name: 'Input Type',
      dataKey: 'inputType',
      values: values.map(v => v.name),
      defaultValue: values[0].name,
    })

    let lastValue = null
    inputType.onData = data => {
      node.data.name = `Input - ${data}`

      let currentValue = values.find(v => v.name === data)

      if(currentValue !== lastValue) {
        const connections = node.getConnections()
        connections.forEach(c => {
          this.editor?.removeConnection(c)
        })
        lastValue = currentValue
      }
      
      if (!currentValue.trigger) {
        node.removeOutput(trigger)
      }
      const newOut = new Rete.Output('output', 'output', currentValue.socket)

      if (currentValue.socket) {
        node.removeOutput(out)
        node.addOutput(newOut)
      }    
    }

    // subscribe the node to the playtest input data stream
    this.subscribeToPlaytest(node)

    // const data = node?.data?.playtestToggle as
    //   | {
    //       receivePlaytest: boolean
    //     }
    //   | undefined

    // const togglePlaytest = new PlaytestControl({
    //   dataKey: 'playtestToggle',
    //   name: 'Receive from playtest input',
    //   defaultValue: {
    //     receivePlaytest:
    //       data?.receivePlaytest !== undefined ? data?.receivePlaytest : true,
    //   },
    //   ignored: ['output'],
    //   label: 'Receive from playtest',
    // })

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

    node.inspector
      .add(inputType)
      // .add(togglePlaytest)
      .add(toggleDefault)
      .add(defaultInput)

    // module components need to have a socket key.
    // todo add this somewhere automated? Maybe wrap the modules builder in the plugin
    node.data.socketKey = node?.data?.socketKey || uuidv4()

    return node
  }

  worker(
    node: NodeData,
    _inputs: MagickWorkerInputs,
    outputs: MagickWorkerOutputs,
    { silent, data }: { silent: boolean; data: string | undefined }
  ) {
    node.data.isInput = true;
    // handle data subscription.  If there is data, this is from playtest
    if (
      data &&
      !isEmpty(data) /* && node.data.playtestToggle.receivePlaytest*/
    ) {
      this._task.closed = []

      const output = Object.values(data)[0] as string

      if (!silent) node.display(data)

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
