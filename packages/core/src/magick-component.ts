import { Node, Socket } from 'rete'

import { PubSubBase, MagickEditor, MagickNode } from '../types'
import { MagickEngineComponent } from './engine'
import { Task, TaskOptions } from './plugins/taskPlugin/task'

// Note: We do this so Typescript knows what extra properties we're
// adding to the NodeEditor (in rete/editor.js). In an ideal world, we
// would be extending the class there, when we instantiate it.
export type PubSubContext = {
  publish: (event: string, data: unknown) => boolean
  subscribe: (event: string, callback: Function) => void
  events: Record<string, any>
  PubSub: PubSubBase
}

export interface MagickTask extends Task {
  outputs?: { [key: string]: string }
  init?: (task?: MagickTask, node?: MagickNode) => void
  onRun?: Function
}

export interface ModuleOptions {
  nodeType: 'input' | 'output' | 'triggerIn' | 'triggerOut' | 'module'
  socket?: Socket
  skip?: boolean
}

export abstract class MagickComponent<
  WorkerReturnType
> extends MagickEngineComponent<WorkerReturnType> {
  // Original interface for task and _task: IComponentWithTask from the Rete Task Plugin
  declare task: TaskOptions
  declare _task: MagickTask
  declare cache: Record<string, any>
  editor: MagickEditor | null = null
  data: unknown = {}
  declare category: string
  declare info: string
  declare display: boolean
  dev = false
  hide = false
  runFromCache = false
  deprecated? = false
  onDoubleClick?: (node: MagickNode) => void
  declare module: ModuleOptions
  contextMenuName: string | undefined
  workspaceType: 'module' | 'spell' | null | undefined
  displayName: string | undefined

  constructor(name: string) {
    super(name)
  }
  abstract builder(node: MagickNode): Promise<MagickNode> | MagickNode | void

  async build(node: MagickNode) {
    await this.builder(node)

    return node
  }

  async createNode(data = {}) {
    const node = new Node(this.name) as MagickNode

    node.data = data
    await this.build(node)

    return node
  }
}
