import type {
  makeAsyncNodeDefinition,
  makeEventNodeDefinition,
  makeFlowNodeDefinition,
  makeFunctionNodeDefinition,
} from '@magickml/behave-graph'

export type FlowNodeDefinition = Parameters<typeof makeFlowNodeDefinition>[0]
export type AsyncNodeDefinition = Parameters<typeof makeAsyncNodeDefinition>[0]
export type EventNodeDefinition = Parameters<typeof makeEventNodeDefinition>[0]
export type FunctionNodeDefinition = Parameters<
  typeof makeFunctionNodeDefinition
>[0]

export type NodeDefinition =
  | FlowNodeDefinition
  | AsyncNodeDefinition
  | EventNodeDefinition
  | FunctionNodeDefinition

export declare const magickNodes: {
  name: string
  handler: NodeDefinition
}[]
