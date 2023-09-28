// DOCUMENTED
import Rete, { Node, Engine, NodeData, Plugin } from 'shared/rete'
import io from 'socket.io'

import { getLogger } from 'shared/core'
import consolePlugin, { DebuggerArgs } from './plugins/consolePlugin'
import ModulePlugin, { ModulePluginArgs } from './plugins/modulePlugin'
import { ModuleManager } from './plugins/modulePlugin/module-manager'
import TaskPlugin, { Task } from './plugins/taskPlugin'
import { TaskOptions } from './plugins/taskPlugin/task'
import {
  GraphData,
  MagickEditor,
  MagickNode,
  MagickWorkerInputs,
  ModuleOptions,
  UnknownData,
  WorkerData,
} from './types'
import RemotePlugin, { RemotePluginArgs } from './plugins/remotePlugin'

// WorkerOutputs interface
interface WorkerOutputs {
  [key: string]: unknown
}

// MagickEngine interface extends Engine
export interface MagickEngine extends Engine {
  getTask: (nodeId: number) => Task
  getTasks: () => Record<string, Task>
  moduleManager: ModuleManager
}

// MagickEngineComponent abstract class
export abstract class MagickEngineComponent<WorkerReturnType> {
  name: string
  data: unknown = {}
  engine: Engine | null = null

  constructor(name: string) {
    this.name = name
  }

  abstract worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    outputs: WorkerOutputs,
    context: unknown,
    ...args: unknown[]
  ): WorkerReturnType
}

// InitEngineArguments type
export type InitEngineArguments = {
  name: string
  components: MagickComponent<unknown>[]
  server: boolean
  throwError?: (message: unknown) => void
  socket?: io.Socket
  emit?: RemotePluginArgs['emit']
}

// initSharedEngine function
export const initSharedEngine = ({
  name,
  components,
  server = false,
  throwError,
  emit,
}: InitEngineArguments) => {
  const engine = new Rete.Engine(name) as MagickEngine

  if (server) {
    engine.use<Plugin, DebuggerArgs>(consolePlugin, {
      server: true,
      throwError,
    })
    engine.use<Plugin, ModulePluginArgs>(ModulePlugin, {
      engine,
    })

    if (emit) {
      engine.use<Plugin, RemotePluginArgs>(RemotePlugin, {
        server: true,
        emit,
      })
    }

    engine.use(TaskPlugin)
  }

  engine.bind('run')

  components.forEach(c => {
    engine.register(c)
  })

  return engine
}

// Function to extract nodes based on the given map
export const extractNodes = (
  nodes: GraphData['nodes'],
  map: Map<string, unknown> | Set<string>
) => {
  const names = Array.from(map.keys())

  return Object.keys(nodes)
    .filter(k => names.includes(nodes[k].name))
    .map(k => nodes[k])
    .sort((n1, n2) => n1.position[1] - n2.position[1])
}

// Function to get the triggered node given a socketKey associated with that node.
export const getTriggeredNode = (
  data: GraphData,
  socketKey: string,
  map: Map<string, unknown> | Set<string>
) => {
  return extractNodes(data.nodes, map).find(
    node => node.data.socketKey === socketKey
  )
}

export type NodeCategory =
  | 'Esoterica'
  | 'Object'
  | 'Number'
  | 'IO'
  | 'Flow'
  | 'Experimental'
  | 'Langchain'
  | 'Github'
  | 'Discord'
  | 'Embedding'
  | 'Documents'
  | 'Code'
  | 'Boolean'
  | 'Array'
  | 'Image'
  | 'Generation'
  | 'Event'
  | 'Text'
  | 'Utility'
  | 'Esoterica'
  | 'Ethereum'
  | 'Pinecone'
  | 'Search'
  | 'Magick'
  | 'Audio'
  | 'Task'
  | 'Database'
  | 'Github'
  | 'Intent'

// MagickComponent abstract class
export abstract class MagickComponent<
  WorkerReturnType
> extends MagickEngineComponent<WorkerReturnType> {
  task: TaskOptions
  _task: Task
  cache: UnknownData
  editor: MagickEditor | null = null
  data: unknown = {}
  category: string
  info: string
  display?: boolean
  dev = false
  hide = false
  runFromCache = false
  deprecated? = false
  common? = false
  onDoubleClick?: (node: MagickNode) => void
  declare module: ModuleOptions
  contextMenuName: string | undefined
  workspaceType: 'spell' | null | undefined
  displayName: string | undefined
  engine: MagickEngine | null = null
  logger = getLogger()

  constructor(name: string, task: TaskOptions, category: string, info: string) {
    super(name)
    this.task = task
    this.category = category
    this.info = info
    this.cache = {}

    this._task = {} as Task
  }

  abstract builder(
    node: MagickNode
  ): Promise<MagickNode> | MagickNode | void | Promise<void>

  async build(node: MagickNode) {
    await this.builder(node)
    return node
  }

  async run(node: NodeData, data = {}, engine: MagickEngine) {
    if (!node || node === undefined) {
      return console.error('node is undefined')
    }

    const task = engine.getTask(node?.id)

    if (!data || Object.keys(data).length === 0) {
      return console.error('data is undefined')
    }

    if (task) await task.run(data as NodeData)
  }

  async createNode(data = {}) {
    const node = new Node(this.name) as MagickNode

    node.data = data as WorkerData
    await this.build(node)

    return node
  }
}

export type MagickComponentArray<T extends MagickComponent<unknown> = any> = T[]
