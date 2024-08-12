export * from './define'
export * from './registry'

import { toolRegistry } from './registry'
import type { ToolDefinition } from '../../types'

export function getTool(name: string): ToolDefinition | undefined {
  return toolRegistry.get(name)
}

export function getAllTools(): Record<string, ToolDefinition> {
  return toolRegistry.getAll()
}
