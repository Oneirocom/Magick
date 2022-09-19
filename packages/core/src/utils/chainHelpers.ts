import { NodesData } from 'rete/types/core/data'

import { GraphData, NodeData } from '../types'

/**
 * extracts all module inputs based upon a given key
 */
export const extractModuleInputKeys = (data: GraphData) =>
  Object.values(data.nodes).reduce((inputKeys, node: NodeData) => {
    if (node.name !== 'Universal Input') return inputKeys
    if (node.data.name && !node.data.useDefault)
      inputKeys.push(node.data.name as string)

    return inputKeys
  }, [] as string[])

/**
 * Extracts nodes from a map of nodes
 */
export function extractNodes(nodes: NodesData, map: Set<unknown>) {
  const names = Array.from(map.keys())
  return Object.keys(nodes)
    .filter(k => names.includes(nodes[k].name))
    .map(k => nodes[k])
    .sort((n1, n2) => n1.position[1] - n2.position[1])
}
