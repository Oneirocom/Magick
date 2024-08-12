import { schemaRegistry } from './registry'
import { z } from 'zod'
import type { AnyZodSchema } from '../../types'

export function getSchema<T extends AnyZodSchema>(
  key: string
): z.infer<T> | undefined {
  const definition = schemaRegistry.get(key)
  return definition ? (definition.schema as T) : undefined
}

export function validateData<T extends AnyZodSchema>(
  key: string,
  data: unknown
): z.infer<T> {
  const schema = getSchema<T>(key)
  if (!schema) {
    throw new Error(`Schema with key "${key}" not found`)
  }
  return schema.parse(data)
}

export function safeValidateData<T extends AnyZodSchema>(
  key: string,
  data: unknown
) {
  const schema = getSchema<T>(key)
  if (!schema) {
    return {
      success: false,
      error: new Error(`Schema with key "${key}" not found`),
    }
  }
  return schema.safeParse(data)
}
