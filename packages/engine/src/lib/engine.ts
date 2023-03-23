import Rete, { Node, Engine } from 'rete'
import { NodeData } from 'rete/types/core/data'
import { Plugin } from 'rete/types/core/plugin'
import io from 'socket.io'

import consolePlugin, { DebuggerArgs } from './plugins/consolePlugin'
import ModulePlugin, { ModulePluginArgs } from './plugins/modulePlugin'
import { ModuleManager } from './plugins/modulePlugin/module-manager'
import SocketPlugin, { SocketPluginArgs } from './plugins/socketPlugin'
import TaskPlugin, { Task } from './plugins/taskPlugin'
import { TaskOptions } from './plugins/taskPlugin/task'
import { GraphData, MagickEditor, MagickNode, MagickTask, MagickWorkerInputs, ModuleOptions, UnknownData, WorkerData } from './types'

interface WorkerOutputs {
  [key: string]: unknown
}

export interface MagickEngine extends Engine {
  tasks: Task[]
  // activateDebugger?: Function
  moduleManager: ModuleManager
}
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
    context: UnknownData | { module: { publicVariables: string } },
    ...args: unknown[]
  ): WorkerReturnType
}

// TODO separate the engine context out from the editor context for cleaner typing.

export type InitEngineArguments = {
  name: string
  components: MagickComponent<unknown>[]
  server: boolean
  throwError?: (message: unknown)=>void
  socket?: io.Socket
}

export const initSharedEngine = ({
  name,
  components,
  server = false,
  throwError,
  socket,
}: InitEngineArguments) => {
  const engine = new Rete.Engine(name) as MagickEngine

  console.log('STARTING ENGINE')
  if (server) {
    // WARNING: ModulePlugin needs to be initialized before TaskPlugin during engine setup
    engine.use<Plugin, DebuggerArgs>(consolePlugin, {
      server: true,
      throwError,
    })
    engine.use<Plugin, ModulePluginArgs>(ModulePlugin, {
      engine,
    })
    if (socket) {
      engine.use<Plugin, SocketPluginArgs>(SocketPlugin, {
        socket,
        server: true,
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

// this parses through all the nodes in the data and finds the nodes associated with the given map
export const extractNodes = (
  nodes: GraphData['nodes'],
  map: Map<string, unknown> | Set<string>,
) => {
  const names = Array.from(map.keys())

  return Object.keys(nodes)
    .filter(
      // make sure node name is in the map
      k => names.includes(nodes[k].name)
    )
    .map(k => nodes[k])
    .sort((n1, n2) => n1.position[1] - n2.position[1])
}

// This will get the node that was triggered given a socketKey associated with that node.
export const getTriggeredNode = (
  data: GraphData,
  socketKey: string,
  map: Map<string, unknown> | Set<string>
) => {
  return extractNodes(data.nodes, map).find(
    node => node.data.socketKey === socketKey
  )
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

  async run(node: NodeData, data = {}) {
    if (!node || node === undefined) {
      return console.error('node is undefined')
    }

    const task = this.nodeTaskMap[node?.id]

    if(!data || Object.keys(data).length === 0) {
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