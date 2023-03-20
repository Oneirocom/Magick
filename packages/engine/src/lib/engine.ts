import Rete, { Engine } from 'rete'
import { Plugin } from 'rete/types/core/plugin'
import { Component } from 'rete/types/engine'
import io from 'socket.io'

import consolePlugin, { DebuggerArgs } from './plugins/consolePlugin'
import ModulePlugin, { ModulePluginArgs } from './plugins/modulePlugin'
import { ModuleManager } from './plugins/modulePlugin/module-manager'
import SocketPlugin, { SocketPluginArgs } from './plugins/socketPlugin'
import TaskPlugin, { Task } from './plugins/taskPlugin'
import { GraphData, MagickWorkerInputs, NodeData, UnknownData } from './types'

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
    node: NodeData,
    inputs: MagickWorkerInputs,
    outputs: WorkerOutputs,
    context: UnknownData,
    ...args: unknown[]
  ): WorkerReturnType
}

// TODO separate the engine context out from the editor context for cleaner typing.

export type InitEngineArguments = {
  name: string
  components: Component[]
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
