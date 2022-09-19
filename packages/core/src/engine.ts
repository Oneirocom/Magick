import io from 'socket.io'
import Rete, { Engine } from 'rete'

import { GraphData, ModuleType, NodeData, ThothWorkerInputs } from './types'
import SocketPlugin from './plugins/socketPlugin'
import debuggerPlugin from './plugins/debuggerPlugin'
import ModulePlugin from './plugins/modulePlugin'
import TaskPlugin, { Task } from './plugins/taskPlugin'
import { extractNodes } from './utils/chainHelpers'

interface WorkerOutputs {
  [key: string]: unknown
}

export interface ThothEngine extends Engine {
  tasks: Task[]
  activateDebugger?: Function
  moduleManager?: any
}
export abstract class ThothEngineComponent<WorkerReturnType> {
  // Original Class: https://github.com/latitudegames/rete/blob/master/src/engine/component.ts
  name: string
  data: unknown = {}
  engine: Engine | null = null

  constructor(name: string) {
    this.name = name
  }

  abstract worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    outputs: WorkerOutputs,
    context: Record<string, any>,
    ...args: unknown[]
  ): WorkerReturnType
}

// TODO separate the engine context out from the editor context for cleaner typing.

export type InitEngineArguments = {
  name: string
  components: any[]
  server: boolean
  modules?: Record<string, ModuleType>
  throwError?: Function
  socket?: io.Socket
}
// @seang TODO: update this to not use positional arguments
export const initSharedEngine = ({
  name,
  components,
  server = false,
  modules = {},
  throwError,
  socket,
}: InitEngineArguments) => {
  const engine = new Rete.Engine(name) as ThothEngine

  if (server) {
    // WARNING: ModulePlugin needs to be initialized before TaskPlugin during engine setup
    engine.use(debuggerPlugin, { server: true, throwError })
    engine.use(ModulePlugin, { engine, modules } as any)
    if (socket) {
      engine.use(SocketPlugin, { socket, server: true })
    }
    engine.use(TaskPlugin)
  }

  engine.bind('run')

  components.forEach(c => {
    engine.register(c)
  })

  return engine
}

// This will get the node that was triggered given a socketKey associated with that node.
export const getTriggeredNode = (
  data: GraphData,
  socketKey: string,
  map: Set<unknown>
) => {
  return extractNodes(data.nodes, map).find(
    node => node.data.socketKey === socketKey
  )
}
