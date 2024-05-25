'use client'

import type { GraphJSON, NodeJSON, NodeSpecJSON } from '@magickml/behave-graph'
import { MagickEdgeType, MagickNodeType } from '@magickml/client-types'

const isNullish = (value: any): value is null | undefined =>
  value === undefined || value === null

const USED_DATA_PROPERTIES = [
  'configuration',
  'nodeSpec',
  'socketsVisible',
  'nodeTitle',
]

function formatVariableNode(nodeType: string): string {
  if (
    nodeType.startsWith('variables/set') ||
    nodeType.startsWith('variables/get') ||
    nodeType.startsWith('variables/on')
  ) {
    // Split the string by '/'
    const parts = nodeType.split('/')
    // Return only the first two parts joined by '/'
    return parts.slice(0, 2).join('/')
  }
  return nodeType
}

export const flowToBehave = (
  nodes: MagickNodeType[],
  edges: MagickEdgeType[],
  nodeSpecJSON: NodeSpecJSON[],
  spellGraph: GraphJSON
): GraphJSON => {
  const graph: GraphJSON = {
    nodes: [],
    variables: spellGraph?.variables || [],
    customEvents: spellGraph?.customEvents || [],
  }

  nodes.forEach(node => {
    if (node.type === 'comment') {
      graph.data = graph.data || {}
      graph.data.comments = graph.data.comments || []
      graph.data.comments.push({
        id: node.id,
        text: node.data.text,
        fontSize: node.data.fontSize,
        width: node.width,
        height: node.height,
        metadata: {
          positionX: String(node.position.x),
          positionY: String(node.position.y),
        },
      })
      return
    }

    if (node.type === undefined) return

    const nodeSpec = nodeSpecJSON.find(nodeSpec => nodeSpec.type === node.type)

    if (nodeSpec === undefined) return

    const behaveNode: NodeJSON = {
      id: node.id,
      type: formatVariableNode(node.type),
      metadata: {
        positionX: String(node.position.x),
        positionY: String(node.position.y),
        nodeTitle: node.data.nodeTitle as string,
      },
      configuration: node.data.configuration || ({} as any),
    }

    // handle configuration properties

    Object.entries(node.data)
      // Filter out data properties we actively uae.
      // Might be best to register these somewhere or something.
      .filter(([key]) => !USED_DATA_PROPERTIES.includes(key))
      .forEach(([key, value]) => {
        if (behaveNode.parameters === undefined) {
          behaveNode.parameters = {}
        }
        behaveNode.parameters[key] = { value: value as string }
      })

    edges
      .filter(edge => edge.target === node.id)
      .forEach(edge => {
        const configSockets = node.data.configuration?.socketInputs || []
        const inputs = [...nodeSpec.inputs, ...configSockets]
        const inputSpec = inputs.find(input => input.name === edge.targetHandle)
        if (inputSpec && inputSpec.valueType === 'flow') {
          // skip flows
          return
        }
        if (behaveNode.parameters === undefined) {
          behaveNode.parameters = {}
        }
        if (isNullish(edge.targetHandle)) return
        if (isNullish(edge.sourceHandle)) return

        // TODO: some of these are flow outputs, and should be saved differently.  -Ben, Oct 11, 2022
        behaveNode.parameters[edge.targetHandle] = {
          link: { nodeId: edge.source, socket: edge.sourceHandle },
        }
      })

    edges
      .filter(edge => edge.source === node.id)
      .forEach(edge => {
        const configSockets = node.data.configuration?.socketOutputs || []
        const outputs = [...nodeSpec.outputs, ...configSockets]

        const outputSpec = outputs.find(
          output => output.name === edge.sourceHandle
        )
        if (outputSpec && outputSpec.valueType !== 'flow') {
          return
        }

        if (behaveNode.flows === undefined) {
          behaveNode.flows = {}
        }
        if (isNullish(edge.targetHandle)) return
        if (isNullish(edge.sourceHandle)) return

        // TODO: some of these are flow outputs, and should be saved differently.  -Ben, Oct 11, 2022
        behaveNode.flows[edge.sourceHandle] = {
          nodeId: edge.target,
          socket: edge.targetHandle,
        }
      })

    // TODO filter out any orphan nodes at this point, to avoid errors further down inside behave-graph

    graph.nodes?.push(behaveNode)
  })

  return graph
}
