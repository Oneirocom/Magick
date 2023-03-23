import { Node, Socket } from 'rete'

import { MagickEditor, MagickNode, UnknownData, WorkerData } from './types'
import { MagickEngineComponent } from './engine'
import { Task, TaskOptions, TaskSocketInfo } from './plugins/taskPlugin/task'
import { NodeData, NodeDataOrEmpty } from 'rete/types/core/data'

export interface MagickTask extends Task {
  outputs?: { [key: string]: string }
  init?: (task?: MagickTask, node?: MagickNode) => void
  onRun?: (node: NodeData, task: Task, data: unknown, socketInfo:TaskSocketInfo) => void
}

export interface ModuleOptions {
  nodeType: 'input' | 'output' | 'triggerIn' | 'triggerOut' | 'module'
  socket?: Socket
  skip?: boolean
  hide?: boolean
}

export type MagicComponentCategory = 'Esoterica' | 'Object' | 'Number' | 'I/O' | 'Flow' | 'Embedding' | 'Document' | 'Code' | 'Boolean' | 'Array' | 'Image' | 'Generation' | 'Event' | 'Text' | 'Utility' | ' Esoterica' | 'Ethereum' | 'Pinecone' | 'Search'

export abstract class MagickComponent<
  WorkerReturnType
> extends MagickEngineComponent<WorkerReturnType> {
  // Original interface for task and _task: IComponentWithTask from the Rete Task Plugin
  task: TaskOptions
  _task?: MagickTask
  cache: UnknownData
  editor: MagickEditor | null = null
  data: unknown = {}
  category: MagicComponentCategory
  info: string
  display?: boolean
  dev = false
  hide = false
  runFromCache = false
  deprecated? = false
  onDoubleClick?: (node: MagickNode) => void
  module?: ModuleOptions
  contextMenuName: string | undefined
  workspaceType: 'spell' | null | undefined
  displayName: string | undefined

  nodeTaskMap: Record<number, MagickTask> = {}

  constructor(name: string, task: TaskOptions, category: MagicComponentCategory, info: string) {
    super(name)
    this.task = task
    this.category = category
    this.info = info
    this.cache = {}
  }

  abstract builder(node: MagickNode): Promise<MagickNode> | MagickNode | void

  async build(node: MagickNode) {
    await this.builder(node)

    return node
  }

  async run(node: NodeData, data: NodeDataOrEmpty = {}) {
    if (!node || node === undefined) {
      return console.error('node is undefined')
    }

    const task = this.nodeTaskMap[node?.id]
    // TODO: Check if data is defined
    if (task) await task.run(data as NodeData)
  }

  async createNode(data = {}) {
    const node = new Node(this.name) as MagickNode

    node.data = data as WorkerData
    await this.build(node)

    return node
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MagickComponentArray<T extends MagickComponent<unknown>=any> = T[]