import { isEmpty } from 'lodash'
import Rete from 'rete'
import { v4 as uuidv4 } from 'uuid'

import {
  anySocket,
  EditorContext,
  InputControl,
  MagickComponent,
  MagickNode,
  MagickTask,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  NodeData,
  Task,
  PlaytestControl,
  SwitchControl,
  TextInputControl,
  eventSocket,
  triggerSocket,
} from '@magickml/engine'

const info = `The input component allows you to pass a single value to your graph.  You can set a default value to fall back to if no value is provided at runtime.  You can also turn the input on to receive data from the playtest input.`

type InputReturn = {
  output: unknown
}

export class DiscordInput extends MagickComponent<InputReturn> {
  nodeTaskMap: Record<number, MagickTask> = {}

  constructor() {
    // Name of the component
    super('Discord Input')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }

    this.module = {
      nodeType: 'triggerIn',
      socket: anySocket,
      hide: true,
    }

    this.category = 'Discord'
    this.info = info
    this.display = true
    this.contextMenuName = 'Discord Input'
    this.displayName = 'Discord Input'
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
        const playtestToggle = node.data.playtestToggle as unknown as {
          receivePlaytest: boolean
        }

        if (!playtestToggle.receivePlaytest) return

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

    // subscribe the node to the playtest input data stream
    this.subscribeToPlaytest(node)

    const out = new Rete.Output('output', 'output', eventSocket)
    const trigger = new Rete.Output('trigger', 'trigger', triggerSocket)

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

    node.inspector.add(togglePlaytest)

    // module components need to have a socket key.
    // todo add this somewhere automated? Maybe wrap the modules builder in the plugin
    node.data.socketKey = node?.data?.socketKey || uuidv4()

    return node.addOutput(trigger).addOutput(out)
  }

  // @ts-ignore
  async worker(
    node: NodeData,
    _inputs: MagickWorkerInputs,
    outputs: MagickWorkerOutputs,
    { silent, data }: { silent: boolean; data: string | undefined }
  ) {
    this._task.closed = ['trigger']
    console.log('********* processing input to discord input *********')
    console.log(data)

    // handle data subscription.  If there is data, this is from playtest
    if (data && !isEmpty(data)) {
      this._task.closed = []

      if (!silent) node.display(data)
      return {
        output: data,
      }
    }
  }
}
