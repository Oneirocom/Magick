'use client'

import type { GraphJSON, Variable } from '@magickml/behave-graph'
import { getNodeSpec } from 'shared/nodeSpec'
import { v4 as uuidv4 } from 'uuid'
import { getConfig } from '../getNodeConfig'
import { getSocketValueType } from '../configureSockets'
import { SpellInterface } from 'server/schemas'
import { MagickEdgeType, MagickNodeType } from '@magickml/client-types'

export type Comment = {
  id: string
  height: number
  width: number
  metadata: {
    positionX: number
    positionY: number
    parentId?: string
  }
  text: string
  fontSize: number
}

export type Group = {
  id: string
  height: number
  width: number
  color?: string
  title?: string
  metadata: {
    positionX: number
    positionY: number
    parentId?: string
  }
}

export const behaveToFlow = (
  graph: GraphJSON,
  spell: SpellInterface
): [MagickNodeType[], MagickEdgeType[]] => {
  const nodes: MagickNodeType[] = []
  const edges: MagickEdgeType[] = []
  const nodeSpecs = getNodeSpec()

  // Start logging time for performance
  console.time('behaveToFlow')

  graph?.data?.comments?.forEach((comment: Comment) => {
    nodes.push({
      id: comment.id,
      type: 'comment',
      style: {
        height: comment.height,
        width: comment.width,
      },
      width: comment.width,
      height: comment.height,
      parentId: comment.metadata?.parentId,
      ...(comment.metadata?.parentId ? { extent: 'parent' } : {}),
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
        fontSize: comment.fontSize,
      },
    })
  })

  graph?.data?.groups?.forEach((group: Group) => {
    nodes.push({
      id: group.id,
      parentId: group.metadata?.parentId,
      type: 'group',
      style: {
        height: group.height,
        width: group.width,
      },
      width: group.width,
      height: group.height,
      position: {
        x: group.metadata?.positionX ? Number(group.metadata?.positionX) : 0,
        y: group.metadata?.positionY ? Number(group.metadata?.positionY) : 0,
      },
      data: {
        color: group.color,
        title: group.title,
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
        (variable: Variable) => variable.id === configuration.variableId
      )
      if (variable) {
        configuration.valueTypeName = variable.valueTypeName
      }
    }

    const node: MagickNodeType = {
      id: nodeJSON.id,
      type: nodeJSON.type,
      parentId: nodeJSON.metadata?.parentId,
      ...(nodeJSON.metadata?.parentId ? { extent: 'parent' } : {}),
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

    // finish logging performance time
  })
  console.timeEnd('behaveToFlow')

  return [nodes, edges]
}
