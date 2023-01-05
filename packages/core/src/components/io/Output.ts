import Rete from 'rete'
import { v4 as uuidv4 } from 'uuid'

import {
  EditorContext,
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../../types'
import { InputControl } from '../../dataControls/InputControl'
import { SwitchControl } from '../../dataControls/SwitchControl'
import { triggerSocket, anySocket } from '../../sockets'
import { ThothComponent } from '../../magick-component'
const info = `The output component will pass values out from your spell.  You can have multiple outputs in a spell and all output values will be collected. It also has an option to send the output to the playtest area for easy testing.`

export class Output extends ThothComponent<void> {
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

  builder(node: ThothNode) {
    const triggerInput = new Rete.Input(
      'trigger',
      'Trigger',
      triggerSocket,
      true
    )
    const triggerOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const textInput = new Rete.Input('input', 'Outputs', anySocket, true)

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
  }

  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    _outputs: ThothWorkerOutputs,
    { silent, magick }: { silent: boolean; magick: EditorContext }
  ) {
    if (!inputs.input) throw new Error('No input provided to output component')

    const text = inputs.input.filter(Boolean)[0] as string

    //just need a new check here for playtest send boolean
    const { sendToPlaytest, sendToAvatar } = magick

    if (node.data.sendToPlaytest && sendToPlaytest) {
      sendToPlaytest(text)
    }

    if (node.data.sendToAvatar && sendToAvatar) {
      sendToAvatar(text)
    }

    if (!silent) node.display(text as string)

    return {
      text,
    }
  }
}
