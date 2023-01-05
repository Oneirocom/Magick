import io from 'socket.io'
import Rete, { Engine } from 'rete'
import { Plugin } from 'rete/types/core/plugin'

import {
  SocketPlugin,
  DebuggerPlugin,
  ModulePlugin,
  TaskPlugin,
  Task,
  GraphData,
  ModuleType,
  NodeData,
  MagickWorkerInputs,
  extractNodes,
  DebuggerArgs,
  ModulePluginArgs,
  SocketPluginArgs,
} from '@magickml/core'

interface WorkerOutputs {
  [key: string]: unknown
}

export interface MagickEngine extends Engine {
  tasks: Task[]
  activateDebugger?: Function
  moduleManager?: any
}
export abstract class MagickEngineComponent<WorkerReturnType> {
  // Original Class: https://github.com/oneirocom/rete/blob/master/src/engine/component.ts
  name: string
  data: unknown = {}
  engine: Engine | null = null

  constructor(name: string) {
    this.name = name
  }

  abstract worker(
    node: NodeData,
    inputs: MagickWorkerInputs,
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
  const engine = new Rete.Engine(name) as MagickEngine

  if (server) {
    // WARNING: ModulePlugin needs to be initialized before TaskPlugin during engine setup
    engine.use<Plugin, DebuggerArgs>(DebuggerPlugin, {
      server: true,
      throwError,
    })
    engine.use<Plugin, ModulePluginArgs>(ModulePlugin, {
      engine,
      modules,
    } as any)
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
