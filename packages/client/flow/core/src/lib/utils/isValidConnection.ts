"use client";
import type { NodeSpecJSON } from '@magickml/behave-graph'
import type { Connection, Edge } from '@xyflow/react'

import { getSocketsByNodeTypeAndHandleType } from './getSocketsByNodeTypeAndHandleType'
import { isHandleConnected } from './isHandleConnected'
import { MagickReactFlowInstance } from '../flow'

export const isValidConnection = (
  connection: Connection | Edge,
  instance: MagickReactFlowInstance,
  specJSON: NodeSpecJSON[]
) => {
  if (connection.source === null || connection.target === null) return false

  const sourceNode = instance.getNode(connection.source)
  const targetNode = instance.getNode(connection.target)
  const edges = instance.getEdges()

  if (sourceNode === undefined || targetNode === undefined) return false

  const sourceSockets = getSocketsByNodeTypeAndHandleType(
    specJSON,
    sourceNode.type,
    'source',
    sourceNode.data.configuration || {}
  )

  const sourceSocket = sourceSockets?.find(
    socket => socket.name === connection.sourceHandle
  )

  const targetSockets = getSocketsByNodeTypeAndHandleType(
    specJSON,
    targetNode.type,
    'target',
    targetNode.data.configuration || {}
  )

  const targetSocket = targetSockets?.find(
    socket => socket.name === connection.targetHandle
  )

  if (sourceSocket === undefined || targetSocket === undefined) return false

  // only flow sockets can have two inputs
  if (
    targetSocket.valueType !== 'flow' &&
    isHandleConnected(edges, targetNode.id, targetSocket.name, 'target')
  ) {
    return false
  }

  return sourceSocket.valueType === targetSocket.valueType
}
