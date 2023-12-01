// DOCUMENTED
import { resolve } from '@feathersjs/schema'
import type { HookContext } from '../declarations'

/**
 * Create a resolver for JSON fields.
 * @param jsonFields - Array of JSON field names.
 * @returns A feathersjs schema resolver for JSON fields.
 */
export const jsonResolver = (jsonFields: string[]) => {
  // Initialize an object to store JSON mutations
  const jsonMutations: Record<string, (value: any) => any> = {}

  // Iterate through each JSON field
  jsonFields.forEach(jsonField => {
    // Assign a function to handle the JSON mutation for each field
    jsonMutations[jsonField] = (value: any) => {
      // Early return if value is null/undefined
      if (!value) return value

      // Only parse if a string is passed as the value
      if (typeof value === 'string')
        return JSON.parse(value as unknown as string)

      // If the value is already JSON, just return it
      return value
    }
  })

  // Return the resolver with the JSON mutations
  return resolve<any, HookContext>(jsonMutations)
}
