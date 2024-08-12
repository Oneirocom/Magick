import { z } from 'zod'
import type { SchemaDefinition, AnyZodSchema } from '../../types'

export function defineSchema<T extends AnyZodSchema>(
  schema: T,
  description?: string
): SchemaDefinition<T> {
  return { schema, description }
}

export function defineStringSchema(options?: {
  min?: number
  max?: number
  description?: string
}) {
  let schema = z.string()
  if (options?.min !== undefined) schema = schema.min(options.min)
  if (options?.max !== undefined) schema = schema.max(options.max)
  return defineSchema(schema, options?.description)
}

export function defineNumberSchema(options?: {
  min?: number
  max?: number
  int?: boolean
  description?: string
}) {
  let schema = z.number()
  if (options?.min !== undefined) schema = schema.min(options.min)
  if (options?.max !== undefined) schema = schema.max(options.max)
  if (options?.int) schema = schema.int()
  return defineSchema(schema, options?.description)
}

export function defineObjectSchema<T extends z.ZodRawShape>(
  shape: T,
  description?: string
) {
  return defineSchema(z.object(shape), description)
}
