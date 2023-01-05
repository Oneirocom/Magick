import { Engine, Socket, Component } from 'rete'
import { Socket as SocketType } from 'rete/types'
import { NodeData } from 'rete/types/core/data'

import {
  GraphData,
  ModuleType,
  ModuleWorkerOutput,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
} from '../../../types'
import { extractNodes } from '../../engine'
import { SocketNameType } from '../../sockets'
import { Module } from './module'
interface ModuleComponent extends Component {
  run: Function
}

export type ModuleSocketType = {
  name: SocketNameType
  socketKey: string
  socket: SocketType
  [key: string]: unknown
}

export type ModuleGraphData = { nodes: Record<string, MagickNode> }
export class ModuleManager {
  engine?: Engine | null
  modules: Record<string, ModuleType>
  inputs = new Map<string, Socket>()
  outputs = new Map<string, Socket>()
  triggerIns = new Map<string, Socket>()
  triggerOuts = new Map<string, Socket>()

  constructor(modules: Record<string, ModuleType>) {
    this.modules = modules
    this.inputs = new Map()
    this.outputs = new Map()
    this.triggerIns = new Map()
    this.triggerOuts = new Map()
  }

  addModule(module: ModuleType) {
    this.modules[module.name] = module
  }

  setModules(modules: Record<string, ModuleType>) {
    this.modules = modules
  }

  updateModule(module: ModuleType) {
    this.modules[module.name as string] = module
  }

  deleteModule(module: ModuleType) {
    delete this.modules[module.name as string]
  }

  getSockets(
    data: GraphData,
    typeMap: Map<string, Socket>,
    defaultName: string
  ): ModuleSocketType[] {
    return extractNodes(data.nodes, typeMap).map(
      (node, i): ModuleSocketType => {
        node.data.name = node.data.name || `${defaultName}-${i + 1}`
        return {
          name: node.data.name as SocketNameType,
          socketKey: node.data.socketKey as string,
          socket: this.socketFactory(node, typeMap.get(node.name)),
        }
      }
    )
  }

  getInputs(data: GraphData): ModuleSocketType[] {
    return this.getSockets(data, this.inputs, 'input')
  }

  getOutputs(data: GraphData): ModuleSocketType[] {
    return this.getSockets(data, this.outputs, 'output')
  }

  getTriggerOuts(data: GraphData): ModuleSocketType[] {
    return this.getSockets(data, this.triggerOuts, 'trigger')
  }

  getTriggerIns(data: GraphData) {
    return this.getSockets(data, this.triggerIns, 'trigger')
  }

  socketFactory(
    node: NodeData,
    socket: Socket | Function | undefined
  ): SocketType {
    // eslint-disable-next-line no-param-reassign
    socket = typeof socket === 'function' ? socket(node) : socket

    if (!socket)
      throw new Error(
        `Socket not found for node with id = ${node.id} in the module`
      )

    return socket as SocketType
  }

  registerInput(name: string, socket: Socket) {
    this.inputs.set(name, socket)
  }

  registerTriggerIn(name: string, socket: Socket) {
    this.triggerIns.set(name, socket)
  }

  registerTriggerOut(name: string, socket: Socket) {
    this.triggerOuts.set(name, socket)
  }

  registerOutput(name: string, socket: Socket) {
    this.outputs.set(name, socket)
  }

  getTriggeredNode(data: GraphData, socketKey: string) {
    return extractNodes(data.nodes, this.triggerIns).find(
      node => node.data.socketKey === socketKey
    )
  }

  async workerModule(
    node: NodeData,
    inputs: MagickWorkerInputs,
    outputs: MagickWorkerOutputs,
    args: { socketInfo: { targetSocket: string } }
  ) {
    if (!node.data.module) return
    if (!this.modules[node.data.module as number]) return
    const moduleName = node.data.module as string
    const data = this.modules[moduleName].data as any
    const module = new Module()
    const engine = this.engine?.clone()

    const parsedInputs = Object.entries(inputs).reduce((acc, input) => {
      const [key, value] = input
      const nodeInputs = node.data.inputs as ModuleSocketType[]
      const name = nodeInputs?.find(
        (n: ModuleSocketType) => n?.socketKey === key
      )?.name
      if (typeof name === 'string') {
        acc[name] = value
        return acc
      }
    }, {} as any)

    module.read(parsedInputs)
    await engine?.process(
      data,
      null,
      Object.assign({}, args, { module, silent: true })
    )

    if ((args?.socketInfo as any)?.targetNode) {
      console.log('targetNode', (args?.socketInfo as any).targetNode)
    }

    if (args?.socketInfo?.targetSocket) {
      const triggeredNode = this.getTriggeredNode(
        data,
        args.socketInfo.targetSocket
      )
      // todo need to remember to update this if/when componnet name changes
      const component = engine?.components.get('Trigger In') as ModuleComponent
      await component?.run(triggeredNode)
    }
    // gather the outputs
    module.write(outputs)

    return module
  }

  workerInputs(
    node: NodeData,
    _inputs: MagickWorkerInputs,
    outputs: ModuleWorkerOutput,
    { module }: { module: Module }
  ) {
    if (!module) return
    const nodeDataName = node.data.name as string
    outputs['output'] = ((module.getInput(nodeDataName) as string[]) ||
      ([] as string[]))[0]
    return outputs
  }

  workerOutputs(
    node: NodeData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    { module }: { module: Module }
  ) {
    if (!module) return
    const socketKey = node.data.socketKey as string
    module.setOutput(socketKey, inputs['input'][0])
  }

  workerTriggerIns(
    _node: NodeData,
    _inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    { module }: { module: Module }
  ) {
    if (!module) return

    // module.setOutput(node.data.name as any, inputs['input'][0])
  }

  workerTriggerOuts(
    node: NodeData,
    _inputs: MagickWorkerInputs,
    outputs: MagickWorkerOutputs,
    { module }: { module: Module }
  ) {
    if (!module) return
    const socketKey = node.data.socketKey as string
    module.setOutput(socketKey, outputs['trigger'])
  }

  setEngine(engine: Engine) {
    this.engine = engine
  }
}
