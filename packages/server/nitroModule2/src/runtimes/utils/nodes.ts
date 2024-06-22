import {
  magickNodes,
  type FlowNodeDefinition,
  type AsyncNodeDefinition,
  type EventNodeDefinition,
  type FunctionNodeDefinition,
  type NodeDefinition,
} from '../../types/virtual/nodes'

import {
  makeFlowNodeDefinition,
  makeAsyncNodeDefinition,
  makeEventNodeDefinition,
  makeFunctionNodeDefinition,
} from '@magickml/behave-graph'

import consola from 'consola'

export function defineFlowNode(definition: FlowNodeDefinition) {
  return makeFlowNodeDefinition(definition)
}

export function defineAsyncNode(definition: AsyncNodeDefinition) {
  return makeAsyncNodeDefinition(definition)
}

export function defineEventNode(definition: EventNodeDefinition) {
  return makeEventNodeDefinition(definition)
}

export function defineFunctionNode(definition: FunctionNodeDefinition) {
  return makeFunctionNodeDefinition(definition)
}

export function defineNode(definition: NodeDefinition) {
  if ('triggered' in definition) {
    return defineFlowNode(definition)
  }
  if ('init' in definition) {
    return defineEventNode(definition)
  }
  if ('exec' in definition) {
    return defineFunctionNode(definition)
  }
  return defineAsyncNode(definition)
}

export function initNodes() {
  const nodeDefinitions = magickNodes.map(n => n.handler as NodeDefinition)
  nodeDefinitions.forEach(nodeDef => {
    consola.success(`Registering node ${nodeDef.typeName}`)
    defineNode(nodeDef)
  })
}
