import Rete from 'rete'
// @seang todo: convert data controls to typescript to remove this
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { v4 as uuidv4 } from 'uuid'

import { MagickComponent, MagickNode } from '../../types'
import { TaskOptions } from '../../plugins/taskPlugin/task'
import { triggerSocket } from '../../sockets'
import { InputControl } from '../../dataControls/InputControl'
const info = `The trigger out component is mainly used to add an output to subspell, ie inside a component of another spell.  It will pass the trigger signal out of the spell to the higher level spell.`

type WorkerReturn = {
  trigger: boolean
}

export class TriggerOut extends MagickComponent<WorkerReturn> {
  task: TaskOptions
  contextMenuName: string

  constructor() {
    super(
      'Trigger Out',
      {
        outputs: {
          trigger: 'output',
        },
      },
      'IO',
      info
    )

    this.contextMenuName = 'Trigger Out'

    this.task = {
      outputs: {
        trigger: 'output',
      },
    }

    this.module = {
      nodeType: 'triggerOut',
      socket: triggerSocket,
    }
  }

  // the builder is used to "assemble" the node component.
  // when we have enki hooked up and have grabbed all few shots, we would use the builder
  // to generate the appropriate inputs and outputs for the fewshot at build time
  builder(node: MagickNode) {
    // create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const input = new Rete.Input('trigger', 'Trigger', triggerSocket, true)

    // Handle default value if data is present
    node.data.name = node.data.name || `trigger-out-${node.id}`

    const nameInput = new InputControl({
      dataKey: 'name',
      name: 'Trigger name',
      defaultValue: node.data.name,
    })

    node.inspector.add(nameInput)
    node.data.socketKey = node?.data?.socketKey || uuidv4()

    return node.addInput(input)
  }

  worker() {
    return {
      trigger: true,
    }
  }
}
