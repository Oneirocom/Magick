import { Node, Edge } from '@xyflow/react'

export type MagickNodeType = Node<Record<string, any>, string>

type EdgeData = {
  valueType: string
  [key: string]: any
}

export type MagickEdgeType = Edge<EdgeData, string>
