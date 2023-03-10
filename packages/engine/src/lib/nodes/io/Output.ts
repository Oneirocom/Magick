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
import { SwitchControl } from '../../dataControls/SwitchControl'
import { triggerSocket, anySocket, eventSocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'
const info = `The output component will pass values out from your spell.  You can have multiple outputs in a spell and all output values will be collected. It also has an option to send the output to the playtest area for easy testing.`


const defaultOutputTypes = [
  { name: 'Respond', socket: anySocket },
]

export class Output extends MagickComponent<void> {
  constructor() {
    super('Output')

    this.task = {
      runOneInput: true,
      outputs: {
        text: 'output',
        trigger: 'option',
      },
    }

    this.module = {
      nodeType: 'output',
      socket: anySocket,
    }

    this.category = 'I/O'
    this.display = true
    this.info = info
  }

  builder(node: MagickNode) {
    const triggerInput = new Rete.Input(
      'trigger',
      'Trigger',
      triggerSocket,
      true
    )
    const triggerOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const textInput = new Rete.Input('input', 'Outputs', anySocket, true)
    const event = new Rete.Input('event', 'Even Override', eventSocket)
    const output = new Rete.Output('output', 'Output', anySocket)

    const values = [...defaultOutputTypes, ...pluginManager.getOutputTypes()]
    node.data.isOutput = true;
    node.data.name = node.data.name ?? `Output - ${values[0].name}`

    const outputType = new DropdownControl({
      name: 'Output Type',
      dataKey: 'outputType',
      values: values.map(v => v.name),
      defaultValue: values[0].name,
    })

    outputType.onData = data => {
      node.data.name = `Output - ${data}`
    }

    const switchControl = new SwitchControl({
      dataKey: 'sendToPlaytest',
      name: 'Send to Playtest',
      label: 'Playtest',
      defaultValue: node.data.sendToPlaytest || true,
    })

    const avatarControl = new SwitchControl({
      dataKey: 'sendToAvatar',
      name: 'Send to Avatar',
      label: 'Avatar',
      defaultValue: node.data.sendToAvatar || false,
    })

    node.inspector
    .add(outputType)
    .add(switchControl)
    .add(avatarControl)
    // need to automate this part!  Wont workw without a socket key
    node.data.socketKey = node?.data?.socketKey || uuidv4()

    return node
      .addInput(triggerInput)
      .addInput(textInput)
      .addInput(event)
      .addOutput(triggerOutput)
      .addOutput(output)
  }

  async worker(
    node: NodeData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    { module, silent, magick }: { module: any, silent: boolean; magick: EditorContext }
  ) {
    if (!inputs.input) throw new Error('No input provided to output component')

    const output = inputs.input.filter(Boolean)[0] as string
    const event = inputs.event?.[0]

    const outputType = node.data.outputType

    if(module.agent) {
      console.log('running on agent')
      console.log('**** HANDLE ME', outputType)
    } else {
      console.log('running on editor or rest api')
      console.log('**** HANDLE ME', outputType)
    }

    if(magick) {

      //just need a new check here for playtest send boolean
      const { sendToPlaytest, sendToAvatar } = magick
      
      if (node.data.sendToPlaytest && sendToPlaytest) {
        sendToPlaytest(output)
      }
      
      if (node.data.sendToAvatar && sendToAvatar) {
        sendToAvatar(output)
      }
    }

    if (!silent) node.display(output as string)

    if(module.agent) {
      // find the outputType in the outputTypes array
      const t = module.agent.outputTypes.find(t => t.name === outputType)

      console.log('t is', t)

      console.log('module', module)
      
      // find outputType in outputTypes where name is outputType
      if(t) {
        console.log('t is not null',  t)
        if(!t.handler) {
          console.error('output type handler is not defined', t)
        } else {
          t.handler({
            output, 
            agent: module.agent,
            event
          })
        }
      }
    }

    return {
      output,
    }
  }
}
