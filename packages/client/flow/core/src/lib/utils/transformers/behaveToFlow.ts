import type { GraphJSON } from '@magickml/behave-graph'
import type { Edge, Node } from 'reactflow'
import { getNodeSpec } from 'shared/nodeSpec'
import { v4 as uuidv4 } from 'uuid'
import { getConfig } from '../getNodeConfig'
import { getSocketValueType } from '../configureSockets'
import { SpellInterface } from 'server/schemas'

export const behaveToFlow = (
  graph: GraphJSON,
  spell: SpellInterface
): [Node[], Edge[]] => {
  const nodes: Node[] = []
  const edges: Edge[] = []
  const nodeSpecs = getNodeSpec()

  graph?.data?.comments?.forEach(comment => {
    nodes.push({
      id: comment.id,
      type: 'comment',
      style: {
        height: comment.height,
        width: comment.width,
      },
      width: comment.width,
      height: comment.height,
      position: {
        x: comment.metadata?.positionX
          ? Number(comment.metadata?.positionX)
          : 0,
        y: comment.metadata?.positionY
          ? Number(comment.metadata?.positionY)
          : 0,
      },
      data: {
        text: comment.text,
      },
    })
  })

  graph.nodes?.forEach(nodeJSON => {
    const spec = nodeSpecs.find(spec => spec.type === nodeJSON.type)
    if (!spec) {
      throw new Error(`Node spec not found for node type: ${nodeJSON.type}`)
    }
    const configuration = getConfig(nodeJSON, spec)

    // PATCH FOR VARIABLE NODES
    if (nodeJSON.type === 'variable' && configuration.variableId) {
      const variable = spell.graph.variables.find(
        variable => variable.id === configuration.variableId
      )
      if (variable) {
        configuration.valueTypeName = variable.valueTypeName
      }
    }

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
        nodeTitle: nodeJSON?.metadata?.nodeTitle,
        configuration,
      } as { [key: string]: any },
    }

    nodes.push(node)

    if (nodeJSON.parameters) {
      for (const [inputKey, input] of Object.entries(nodeJSON.parameters)) {
        const valueType = getSocketValueType(inputKey, nodeJSON, spec)
        if ('link' in input && input.link !== undefined) {
          edges.push({
            id: uuidv4(),
            source: input.link.nodeId,
            sourceHandle: input.link.socket,
            target: nodeJSON.id,
            type: 'custom-edge',
            targetHandle: inputKey,
            updatable: true,
            data: {
              valueType,
            },
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
          data: {
            valueType: 'flow',
          },
        })
      }
    }
  })

  return [nodes, edges]
}
