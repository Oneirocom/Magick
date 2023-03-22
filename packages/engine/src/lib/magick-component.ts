import { Node, Socket } from 'rete'

import { MagickEditor, MagickNode, UnknownData } from './types'
import { MagickEngineComponent } from './engine'
import { Task, TaskOptions, TaskSocketInfo } from './plugins/taskPlugin/task'
import { NodeData } from 'rete/types/core/data'

export interface MagickTask extends Task {
  outputs?: { [key: string]: string }
  init?: (task?: MagickTask, node?: MagickNode) => void
  onRun?: (
    node: NodeData,
    task: Task,
    data: unknown,
    socketInfo: TaskSocketInfo
  ) => void
}

export interface ModuleOptions {
  nodeType: 'input' | 'output' | 'triggerIn' | 'triggerOut' | 'module'
  socket?: Socket
  skip?: boolean
  hide?: boolean
}

export abstract class MagickComponent<
  WorkerReturnType
> extends MagickEngineComponent<WorkerReturnType> {
  // Original interface for task and _task: IComponentWithTask from the Rete Task Plugin
  declare task: TaskOptions
  declare _task: MagickTask
  declare cache: UnknownData
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
  workspaceType: 'spell' | null | undefined
  displayName: string | undefined

  nodeTaskMap: Record<number, MagickTask> = {}

  abstract builder(node: MagickNode): Promise<MagickNode> | MagickNode | void

  async build(node: MagickNode) {
    await this.builder(node)

    return node
  }

  async run(node: NodeData, data: NodeData) {
    if (!node || node === undefined) {
      return console.error('node is undefined')
    }

    const task = this.nodeTaskMap[node?.id]
    if (task) await task.run(data)
  }

  async createNode(data = {}) {
    const node = new Node(this.name) as MagickNode

    node.data = data
    await this.build(node)

    return node
  }
}
