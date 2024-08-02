import type { FeatureDefinition } from 'nova'

export interface NodeHandler {
  (data: Uint8Array, subject: string, replyTo?: string): Promise<void> | void
}

export type NodeHandlerVirtual = () => Promise<{
  default: NodeDefinition
}>

export interface NodeDefinition {
  subject: string
  handler: NodeHandler
  options?: NodeOptions
}

declare module 'nitro/types' {
  interface Nitro {
    scannedGrimoireNodes: NodeDefinition[]
  }
  // interface NitroRuntimeHooks extends NatsHooks {}
  interface NitroApp {
    nodes: {
      [key: string]: NodeHandler
    }
  }
}

export {}
