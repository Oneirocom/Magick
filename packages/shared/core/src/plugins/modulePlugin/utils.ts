import { Input, NodeEditor, Output } from 'shared/rete'

import {
  DataSocketType,
  MagickNode,
  IRunContextEditor,
  AsDataSocket,
  AsInputsData,
  AsOutputsData,
} from '../../types'
import { socketNameMap, SocketNameType } from '../../sockets'
import { ModuleSocketType } from './module-manager'
export type ThroughPutType = 'outputs' | 'inputs'

const getRemovedSockets = (
  existingSockets: DataSocketType[],
  newSockets: ModuleSocketType[]
) => {
  return existingSockets.filter(
    existing =>
      !newSockets.some(incoming => incoming.socketKey === existing.socketKey)
  )
}

const removeSockets = (
  node: MagickNode,
  sockets: DataSocketType[],
  type: 'input' | 'output',
  editor: NodeEditor
) => {
  sockets.forEach(socket => {
    const connections = node.getConnections().filter(con => {
      // cant use key to compare because it changes by user preference
      // unchanging key but mutable name? or add new id property to things?
      return (
        con.input.key === socket.socketKey ||
        con.output.key === socket.socketKey
      )
    })

    if (connections)
      connections.forEach(con => {
        editor.removeConnection(con)
      })

    // need to get the socket from the node first since this isnt the sockey object

    const removeMethod = type === 'input' ? 'removeInput' : 'removeOutput'
    const removedSocket = node[(type + 's') as 'inputs' | 'outputs'].get(
      socket.socketKey
    )
    if (removedSocket) node[removeMethod](removedSocket as Input & Output)
    const nodeData = node.data as Record<string, DataSocketType[]>
    nodeData[type + 's'] = nodeData[type + 's'].filter(
      soc => soc.socketKey !== socket.socketKey
    )
  })
}

const updateSockets = (node: MagickNode, sockets: ModuleSocketType[]) => {
  sockets.forEach(({ socketKey, name }) => {
    if (node.inputs.has(socketKey)) {
      const input = node.inputs.get(socketKey) as Input
      input.name = name
      node.inputs.set(socketKey, input)
      // Update the nodes data sockets as well
      const nodeInputs = AsDataSocket(node.data.inputs)
      node.data.inputs = AsInputsData(
        nodeInputs.map((n: DataSocketType) => {
          if (n.socketKey === socketKey) {
            n.name = name
          }

          return n
        })
      )
    }
    if (node.outputs.has(socketKey)) {
      const output = node.outputs.get(socketKey) as Output
      output.name = name
      node.outputs.set(socketKey, output)
      const nodeOutputs = node.data.outputs as unknown as DataSocketType[]
      node.data.outputs = AsOutputsData(
        nodeOutputs.map(n => {
          if (n.socketKey === socketKey) {
            n.name = name
          }

          return n
        })
      )
    }
  })
}

type AddSockets = {
  node: MagickNode
  sockets: ModuleSocketType[]
  connectionType: 'input' | 'output'
  taskType?: 'option' | 'output'
  useSocketName?: boolean
}

const addSockets = ({
  node,
  sockets,
  connectionType,
  taskType = 'output',
  useSocketName = false,
}: AddSockets) => {
  const uniqueCount = new Set(sockets.map(i => i.name)).size
  const currentConnection = AsDataSocket(
    node.data[(connectionType + 's') as ThroughPutType]
  )
  const existingSockets = currentConnection.map(
    (soc: DataSocketType) => soc.socketKey
  )

  if (uniqueCount !== sockets.length)
    return console.error(
      `Module ${node.data.spell} has duplicate ${
        taskType === 'option' ? 'trigger' : ''
      } ${connectionType}s`
    )

  updateSockets(node, sockets)

  const newSockets = sockets.filter(
    socket =>
      !existingSockets.includes(socket.socketKey) &&
      !existingSockets.includes(socket.name)
  )

  if (newSockets.length > 0)
    newSockets.forEach(newSocket => {
      const { name, socket, socketKey } = newSocket

      const Socket = connectionType === 'output' ? Output : Input
      const addMethod = connectionType === 'output' ? 'addOutput' : 'addInput'
      const currentConnection = AsDataSocket(
        node.data[(connectionType + 's') as ThroughPutType]
      )

      currentConnection.push({
        name: name as SocketNameType,
        taskType: taskType,
        socketKey: socketKey,
        connectionType: connectionType,
        useSocketName,
        hide: socket.hide,
        socketType: socketNameMap[socket.name as SocketNameType],
      })

      if (newSocket.socket.hide) return

      node[addMethod](new Socket(socketKey, name, socket) as Input & Output)
      if (connectionType === 'output') {
        node.inspector.component.task.outputs[socketKey] = taskType

        // support both key and name task outputs
        node.inspector.component.task.outputs[name] = taskType
      }
    })
}

type AddIO = {
  node: MagickNode
  inputs: ModuleSocketType[]
  outputs: ModuleSocketType[]
  triggerOuts: ModuleSocketType[]
  triggerIns: ModuleSocketType[]
  useSocketName: boolean
}

export function addIO({
  node,
  inputs,
  outputs,
  triggerOuts,
  triggerIns,
  useSocketName,
}: AddIO) {
  // This is SOOOOO messy.
  if (inputs?.length > 0)
    addSockets({
      node,
      sockets: inputs,
      connectionType: 'input',
      useSocketName,
    })
  if (triggerIns?.length > 0)
    addSockets({
      node,
      sockets: triggerIns,
      connectionType: 'input',
      taskType: 'option',
      useSocketName,
    })
  if (outputs?.length > 0)
    addSockets({
      node,
      sockets: outputs,
      connectionType: 'output',
      useSocketName,
    })
  if (triggerOuts?.length > 0)
    addSockets({
      node,
      sockets: triggerOuts,
      connectionType: 'output',
      taskType: 'option',
      useSocketName,
    })
}

// here we can only remove the inputs and outputs that are not supposed to be on the node.
// This means we determine which IO are present on the node but not in the incoming IO
export function removeIO(
  node: MagickNode,
  editor: IRunContextEditor,
  inputs: ModuleSocketType[],
  outputs: ModuleSocketType[]
) {
  const existingInputs = AsDataSocket(node.data.inputs)
  const existingOutputs = AsDataSocket(node.data.outputs)
  const inputRemovals = getRemovedSockets(existingInputs, inputs)
  const outputRemovals = getRemovedSockets(existingOutputs, outputs)

  if (inputRemovals.length > 0)
    removeSockets(node, inputRemovals, 'input', editor)
  if (outputRemovals.length > 0)
    removeSockets(node, outputRemovals, 'output', editor)
}
