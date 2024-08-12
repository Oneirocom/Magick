import type { z } from 'zod'
export type AnyZodSchema = z.ZodTypeAny

export interface SchemaDefinition<T extends AnyZodSchema = AnyZodSchema> {
  schema: T
  description?: string
}

export type SchemaRegistry = Map<string, SchemaDefinition>

declare module 'nitro/types' {
  interface NitroApp {
    schemaRegistry: SchemaRegistry
  }
}
