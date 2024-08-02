import type { FeatureDefinition } from 'nova'
import type {
  makeAsyncNodeDefinition,
  makeEventNodeDefinition,
  makeFlowNodeDefinition,
  makeFunctionNodeDefinition,
} from '@magickml/behave-graph'
import type { ZodObject } from 'zod'

// ---------- NODES ----------
export type FlowNodeDefinition = Parameters<typeof makeFlowNodeDefinition>[0]
export type AsyncNodeDefinition = Parameters<typeof makeAsyncNodeDefinition>[0]
export type EventNodeDefinition = Paruameters<typeof makeEventNodeDefinition>[0]
export type FunctionNodeDefinition = Parameters<
  typeof makeFunctionNodeDefinition
>[0]

export type NodeDefinition =
  | FlowNodeDefinition
  | AsyncNodeDefinition
  | EventNodeDefinition
  | FunctionNodeDefinition

export interface NodeHandler {
  (any): any
}

export type NodeHandlerVirtual = () => Promise<{
  default: NodeDefinition
}>

// ---------- SCHEMA ----------
export type SchemaDefinition = ZodObject<any, any>
export type SchemaHandlerVirtual = () => Promise<{
  default: SchemaDefinition
}>

export interface SchemaHandler {
  (any): any
}

declare module 'nitro/types' {
  interface Nitro {
    scannedGrimoireNodes: NodeHandler[]
    scannedGrimoireSchemas: SchemaHandler[]
  }
  // interface NitroRuntimeHooks extends NatsHooks {}
  interface NitroApp {
    agent: any
    agentClient: any
    nodes: {
      [key: string]: NodeHandlerVirtual
    }
    schemas: {
      [key: string]: SchemaHandlerVirtual
    }
  }
}

export {}
