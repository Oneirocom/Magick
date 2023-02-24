import Rete from 'rete'
import { v4 as uuidv4 } from 'uuid'

import {
    anySocket, EditorContext, InputControl, MagickComponent, MagickNode,
    MagickWorkerInputs,
    MagickWorkerOutputs, NodeData, triggerSocket, SwitchControl
  } from "@magickml/engine";

const info = `The output component will pass values out from your spell.  You can have multiple outputs in a spell and all output values will be collected. It also has an option to send the output to the playtest area for easy testing.`

export class DiscordOutput extends MagickComponent<void> {
  constructor() {
    super('Discord Output')

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

    this.category = 'Discord'
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

    node.inspector.add(switchControl).add(avatarControl)
    // need to automate this part!  Wont workw without a socket key
    node.data.socketKey = node?.data?.socketKey || uuidv4()

    return node
      .addInput(triggerInput)
      .addInput(textInput)
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

    return {
      output,
    }
  }
}
