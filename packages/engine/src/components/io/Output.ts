import Rete from 'rete'
import { v4 as uuidv4 } from 'uuid'

import {
  EditorContext,
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
} from '../../types'
import { InputControl } from '../../dataControls/InputControl'
import { SwitchControl } from '../../dataControls/SwitchControl'
import { triggerSocket, anySocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'
const info = `The output component will pass values out from your spell.  You can have multiple outputs in a spell and all output values will be collected. It also has an option to send the output to the playtest area for easy testing.`

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
    const output = new Rete.Output('output', 'Output', anySocket)

    node.data.name = node.data.name || `output-${node.id}`

    const nameInput = new InputControl({
      dataKey: 'name',
      name: 'Output name',
      defaultValue: node.data.name,
    })

    const switchControl = new SwitchControl({
      dataKey: 'sendToPlaytest',
      name: 'Send to Playtest',
      label: 'Playtest',
      defaultValue: node.data.sendToPlaytest || false,
    })

    const avatarControl = new SwitchControl({
      dataKey: 'sendToAvatar',
      name: 'Send to Avatar',
      label: 'Avatar',
      defaultValue: node.data.sendToAvatar || false,
    })

    node.inspector.add(nameInput).add(switchControl).add(avatarControl)
    // need to automate this part!  Wont workw without a socket key
    node.data.socketKey = node?.data?.socketKey || uuidv4()

    return node
      .addInput(textInput)
      .addInput(triggerInput)
      .addOutput(triggerOutput)
      .addOutput(output)
  }

  async worker(
    node: NodeData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    { silent, magick }: { silent: boolean; magick: EditorContext }
  ) {
    if (!inputs.input) throw new Error('No input provided to output component')

    const output = inputs.input.filter(Boolean)[0] as string

    //just need a new check here for playtest send boolean
    const { sendToPlaytest, sendToAvatar } = magick

    if (node.data.sendToPlaytest && sendToPlaytest) {
      sendToPlaytest(output)
    }

    if (node.data.sendToAvatar && sendToAvatar) {
      sendToAvatar(output)
    }

    if (!silent) node.display(output as string)

    return {
      output,
    }
  }
}
