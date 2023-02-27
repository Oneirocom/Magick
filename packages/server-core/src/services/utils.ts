import { resolve } from '@feathersjs/schema'
import { doesDbSupportJson } from '../dbClient'
import type { HookContext } from '../declarations'

export const jsonResolver = (jsonFields: string[]) => {
  const jsonMutations = {}
  jsonFields.forEach(jsonField => {
    jsonMutations[jsonField] = (value: any) => {
      // early return if value is null/undefined
      if (!value) return value
      // only parse if a string is passed as the value
      if (typeof value === 'string') return JSON.parse(value as unknown as string)
      // if the value is already json just return it
      return value
    }
  })
  return resolve<any, HookContext>(jsonMutations)
}

export const handleJSONFieldsUpdate = (jsonFields: string[]) => (context: any) => {
  // check if db supports json
  if (!doesDbSupportJson()) {
    jsonFields.forEach(jsonField => {
      // if the field is updated, make sure we're storing it as a string
      if (context.data[jsonField])
        context.data[jsonField] = JSON.stringify(context.data[jsonField]);
    })
  }
}
