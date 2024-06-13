import { Type, Static } from '@feathersjs/typebox'
import { getDataValidator } from '@feathersjs/typebox'
import { dataValidator } from 'server/core'

// Define the schema for the toggleRunAll event
const toggleRunAllSchema = Type.Object({
  agentId: Type.String(),
  start: Type.Boolean(),
})

export type ToggleRunAllData = Static<typeof toggleRunAllSchema>
export const toggleRunAllValidator = getDataValidator(
  toggleRunAllSchema,
  dataValidator
)
