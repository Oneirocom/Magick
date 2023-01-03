import { Node, Socket } from 'rete'

import { PubSubBase, ThothNode } from '../types'
import { ThothEditor } from './editor'
import { ThothEngineComponent } from './engine'
import { Task, TaskOptions } from './plugins/taskPlugin/task'

// Note: We do this so Typescript knows what extra properties we're
// adding to the NodeEditor (in rete/editor.js). In an ideal world, we
// would be extending the class there, when we instantiate it.
export type PubSubContext = {
  publish: (event: string, data: unknown) => boolean
  subscribe: (event: string, callback: Function) => void
  events: Record<string, (tabId: string) => string>
  PubSub: PubSubBase
}

export interface ThothTask extends Task {
  outputs?: { [key: string]: string }
  init?: (task?: ThothTask, node?: ThothNode) => void
  onRun?: Function
}

export interface ModuleOptions {
  nodeType: 'input' | 'output' | 'triggerIn' | 'triggerOut' | 'module'
  socket?: Socket
  skip?: boolean
}

export abstract class ThothComponent<
  WorkerReturnType
> extends ThothEngineComponent<WorkerReturnType> {
  // Original interface for task and _task: IComponentWithTask from the Rete Task Plugin
  task: TaskOptions
  _task: ThothTask
  cache: Record<string, any>
  // Original Class: https://github.com/AtlasFoundation/rete/blob/master/src/component.ts
  editor: ThothEditor | null = null
  data: unknown = {}
  category: string
  info: string
  display: boolean
  dev = false
  hide = false
  runFromCache = false
  deprecated? = false
  module: ModuleOptions
  contextMenuName: string | undefined
  workspaceType: 'module' | 'spell' | null | undefined
  displayName: string | undefined

  constructor(name: string) {
    super(name)
  }
  abstract builder(node: ThothNode): Promise<ThothNode> | ThothNode | void

  async build(node: ThothNode) {
    await this.builder(node)

    return node
  }

  async createNode(data = {}) {
    const node = new Node(this.name) as ThothNode

    node.data = data
    await this.build(node)

    return node
  }
}
