"use client";
import type { Edge, Node } from '@xyflow/react'

export const autoLayout = (nodes: Node[], edges: Edge[]) => {
  let x = 0
  nodes.forEach(node => {
    node.position.x = x
    x += 200
  })
}
