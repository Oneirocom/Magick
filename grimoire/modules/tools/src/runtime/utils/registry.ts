import type { ToolRegistry, ToolDefinition } from '../../types'

// This is a mock, though we don't have an existing implementation to migrate
class ToolRegistryManager implements ToolRegistry {
  private tools: Record<string, ToolDefinition> = {}

  register(name: string, definition: ToolDefinition): void {
    if (this.tools[name]) {
      console.warn(`Tool with name "${name}" already exists. Overwriting.`)
    }
    this.tools[name] = definition
  }

  unregister(name: string): void {
    delete this.tools[name]
  }

  get(name: string): ToolDefinition | undefined {
    return this.tools[name]
  }

  getAll(): Record<string, ToolDefinition> {
    return { ...this.tools }
  }
}

export const toolRegistry = new ToolRegistryManager()
