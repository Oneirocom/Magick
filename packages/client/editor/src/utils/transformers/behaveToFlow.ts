import { GraphJSON } from '@magickml/behave-graph'
import { getNodeSpec } from 'shared/nodeSpec'
import { Edge, Node } from 'reactflow'
import { v4 as uuidv4 } from 'uuid'
import { getConfig } from '../getNodeConfig'

export const behaveToFlow = (graph: GraphJSON): [Node[], Edge[]] => {
  const nodes: Node[] = []
  const edges: Edge[] = []
  const nodeSpecs = getNodeSpec()
  console.log('Converting graph to flow')

  graph.nodes?.forEach(nodeJSON => {
    const spec = nodeSpecs.find(spec => spec.type === nodeJSON.type)
    const configuration = getConfig(nodeJSON, spec)

    const node: Node = {
      id: nodeJSON.id,
      type: nodeJSON.type,
      position: {
        x: nodeJSON.metadata?.positionX
          ? Number(nodeJSON.metadata?.positionX)
          : 0,
        y: nodeJSON.metadata?.positionY
          ? Number(nodeJSON.metadata?.positionY)
          : 0,
      },
      data: {
        nodeSpec: spec,
        configuration,
      } as { [key: string]: any },
    }

    nodes.push(node)

    if (nodeJSON.parameters) {
      for (const [inputKey, input] of Object.entries(nodeJSON.parameters)) {
        if ('link' in input && input.link !== undefined) {
          edges.push({
            id: uuidv4(),
            source: input.link.nodeId,
            sourceHandle: input.link.socket,
            target: nodeJSON.id,
            type: 'custom-edge',
            targetHandle: inputKey,
            updatable: 'target',
          })
        }
        if ('value' in input) {
          node.data[inputKey] = input.value
        }
      }
    }

    if (nodeJSON.flows) {
      for (const [inputKey, link] of Object.entries(nodeJSON.flows)) {
        edges.push({
          id: uuidv4(),
          source: nodeJSON.id,
          sourceHandle: inputKey,
          type: 'custom-edge',

          target: link.nodeId,
          targetHandle: link.socket,
          updatable: 'target',
        })
      }
    }
  })

  return [nodes, edges]
}
