import {
  type FlowNodeDefinition,
  type AsyncNodeDefinition,
  type EventNodeDefinition,
  type FunctionNodeDefinition,
  type NodeDefinition,
} from '../../../types/grimoire'

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
