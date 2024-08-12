import { tool } from 'ai'

export type ToolDefinition = ReturnType<typeof tool>

export interface ToolRegistry {
  get: (name: string) => ToolDefinition | undefined
  getAll: () => Record<string, ToolDefinition>
  register: (name: string, definition: ToolDefinition) => void
  unregister: (name: string) => void
}

declare module 'nitro/types' {
  interface NitroApp {
    toolRegistry: ToolRegistry
  }
}
