import Rete from 'rete'
// @seang todo: convert data controls to typescript to remove this
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { v4 as uuidv4 } from 'uuid'

import { NodeData, MagickNode } from '../../types'
import { InputControl } from '../../dataControls/InputControl'
import { PlaytestControl } from '../../dataControls/PlaytestControl'
import { triggerSocket } from '../../sockets'
import { MagickComponent, MagickTask } from '../../magick-component'

const info = `The trigger in allows you to pass values into your spell either from a higher level component or from the server.  There must be one single trigger into a spell for now as the server does not support multiple triggers.  Yet.`

export class TriggerIn extends MagickComponent<void> {
  nodeTaskMap: Record<number, MagickTask> = {}

  constructor() {
    // Name of the component
    // If name of component changes please update module-manager workerModule code
    super('Trigger In')
    this.displayName = 'Trigger In'
    this.contextMenuName = 'Trigger In'

    this.task = {
      outputs: {
        trigger: 'option',
      },
      init: (task: MagickTask, node: MagickNode) => {
        // store the nodes task inside the component
        this.nodeTaskMap[node.id] = task
      },
    }

    this.module = {
      nodeType: 'triggerIn',
      socket: triggerSocket,
    }

    this.category = 'I/O'

    this.info = info
  }

  subscriptionMap: Record<string, Function> = {}

  unsubscribe?: () => void

  subscribeToPlaytest(node: MagickNode) {
    const { onPlaytest } = this.editor?.magick as any

    // check node for the right data attribute
    if (onPlaytest) {
      // store the unsubscribe function in our node map
      this.subscriptionMap[node.id] = onPlaytest((text: string) => {
        // if the node doesnt have playtest toggled on, do nothing
        const playtestToggle = node.data.playtestToggle as unknown as {
          receivePlaytest: boolean
        }
        if (!playtestToggle.receivePlaytest) return

        const task = this.nodeTaskMap[node.id]

        // will need to run this here with the stater rather than the text
        task?.run(text)
        task?.reset()
        this.editor?.trigger('process')
      })
    }
  }

  destroyed(node: MagickNode) {
    if (this.subscriptionMap[node.id]) this.subscriptionMap[node.id]()
    delete this.subscriptionMap[node.id]
  }

  async run(node: MagickNode, data: NodeData) {
    if (!node || node === undefined) {
      throw new Error('node is undefined')
    }

    const task = this.nodeTaskMap[node?.id]
    if (task) await task.run(data)
  }

  // the builder is used to "assemble" the node component.

  builder(node: MagickNode) {
    if (this.subscriptionMap[node.id]) this.subscriptionMap[node.id]()
    delete this.subscriptionMap[node.id]

    // create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const out = new Rete.Output('trigger', 'Trigger', triggerSocket)
    node.data.socketKey = node?.data?.socketKey || uuidv4()

    // Handle default value if data is present
    const nameInput = new InputControl({
      dataKey: 'name',
      name: 'Trigger name',
    })

    // subscribe the node to the playtest input data stream
    this.subscribeToPlaytest(node)

    const data = node?.data?.playtestToggle as
      | {
          receivePlaytest: boolean
        }
      | undefined

    const togglePlaytest = new PlaytestControl({
      dataKey: 'playtestToggle',
      name: 'Receive from playtest input',
      defaultValue: {
        receivePlaytest:
          data?.receivePlaytest !== undefined ? data?.receivePlaytest : true,
      },
      ignored: ['output'],
      label: 'Receive from playtest',
    })

    node.inspector.add(nameInput).add(togglePlaytest)

    return node.addOutput(out)
  }

  worker() {
    return {}
  }
}
