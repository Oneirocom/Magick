import type {
  SchemaRegistry,
  SchemaDefinition,
  AnyZodSchema,
} from '../../types'

// This is a mock, though we don't have an existing implementation to migrate
class SchemaRegistryManager {
  private registry: SchemaRegistry = new Map()

  register<T extends AnyZodSchema>(
    key: string,
    definition: SchemaDefinition<T>
  ) {
    if (this.registry.has(key)) {
      console.warn(`Schema with key "${key}" already exists. Overwriting.`)
    }
    this.registry.set(key, definition)
  }

  get(key: string): SchemaDefinition | undefined {
    return this.registry.get(key)
  }

  has(key: string): boolean {
    return this.registry.has(key)
  }

  getAll(): SchemaRegistry {
    return new Map(this.registry)
  }
}

export const schemaRegistry = new SchemaRegistryManager()
