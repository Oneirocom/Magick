import { Engine, Socket } from 'shared/rete'
import { Socket as SocketType } from 'rete/types'
import { NodeData } from 'rete/types/core/data'

import { extractNodes } from '../../engine'
import { SocketNameType } from '../../sockets'
import {
  GraphData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  ModuleContext,
  ModuleType,
  ModuleWorkerOutput,
} from '../../types'
import { Module } from './module'

export type ModuleSocketType = {
  name: string
  socketKey: string
  socket: SocketType
  hide?: boolean
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

  getSockets(
    data: GraphData,
    typeMap: Map<string, Socket>,
    defaultName: string
  ): ModuleSocketType[] {
    console.log('GETTING SOCKETS')
    return extractNodes(data.nodes, typeMap)
      .filter(n => {
        return n.name !== 'Input'
      })
      .map((node, i): ModuleSocketType => {
        const name = (node.data.name || `${defaultName}-${i + 1}`) as string
        return {
          name,
          socketKey: node.data.socketKey as string,
          socket: this.socketFactory(node, typeMap.get(node.name)),
        }
      })
  }

  getInputs(data: GraphData): ModuleSocketType[] {
    console.log('Getting inputs', this.getSockets(data, this.inputs, 'input'))
    return this.getSockets(data, this.inputs, 'input')
  }

  getOutputs(data: GraphData): ModuleSocketType[] {
    return this.getSockets(data, this.outputs, 'output')
  }

  getTriggerOuts(data: GraphData): ModuleSocketType[] {
    return this.getSockets(data, this.outputs, 'trigger')
  }

  getTriggerIns(data: GraphData) {
    return this.getSockets(data, this.inputs, 'trigger')
  }

  socketFactory(
    node: NodeData,
    socket: Socket | ((node: NodeData) => Socket) | undefined
  ): SocketType {
    socket = typeof socket === 'function' ? socket(node) : socket

    if (!socket)
      throw new Error(
        `Socket not found for node with id = ${node.id} in the module`
      )

    return socket as SocketType
  }

  registerInput(name: string, socket: Socket, hide = false) {
    socket.hide = hide
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
    context: ModuleContext
  ) {
    if (!node.data.spell) return
    if (!this.modules[node.data.spell as number]) return
    const moduleName = node.data.spell as string
    const data = this.modules[moduleName].data
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
      return acc
    }, {} as Record<string, unknown>)

    console.log(
      '*** MODULE MANAGER: publicVariables are',
      context.module.publicVariables
    )

    module.read({
      inputs: parsedInputs,
      secrets: context.module.secrets,
      publicVariables: context.module.publicVariables,
      app: context.module.app,
      sessionId: context.module.sessionId,
    })
    await engine?.process(data, null, Object.assign({}, context, { module }))

    if (context?.socketInfo?.targetSocket) {
      const triggeredNode = this.getTriggeredNode(
        data,
        context.socketInfo.targetSocket
      )
      if (!triggeredNode) throw new Error('Triggered node not found')
      // todo need to remember to update this if/when componnet name changes
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
    _node,
    _inputs,
    _outputs,
    { module, data }: { module: Module; data: Record<string, unknown> }
  ) {
    if (!module) return

    return data
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
