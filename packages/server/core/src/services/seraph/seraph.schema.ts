import { resolve } from '@feathersjs/schema'
import type { Static } from '@feathersjs/typebox'
import {
  getDataValidator,
  getValidator,
  querySyntax,
  Type,
} from '@feathersjs/typebox'
import { dataValidator, queryValidator } from '../../config/validators'
import type { HookContext } from '../../declarations'
import { seraphEventSchema } from 'server/schemas'
import { ISeraphEvent } from 'servicesShared'

export const seraphEventResolver = resolve<ISeraphEvent, HookContext>({})
export const seraphEventExternalResolver = resolve<ISeraphEvent, HookContext>(
  {}
)

// Schema for creating new entries, removing additional fields
// Define the properties for the new schema
const seraphEventDataSchemaProperties = {
  agentId: seraphEventSchema.properties.agentId,
  projectId: seraphEventSchema.properties.projectId,
  type: seraphEventSchema.properties.type,
  request: seraphEventSchema.properties.request,
  response: seraphEventSchema.properties.response,
  error: seraphEventSchema.properties.error,
  info: seraphEventSchema.properties.info,
  createdAt: seraphEventSchema.properties.createdAt,
}

export const seraphEventDataSchema = Type.Object(
  seraphEventDataSchemaProperties,
  {
    $id: 'SeraphEventData',
  }
)

export type SeraphEventData = Static<typeof seraphEventDataSchema>
export const seraphEventDataValidator = getDataValidator(
  seraphEventDataSchema,
  dataValidator
)
export const seraphEventDataResolver = resolve<ISeraphEvent, HookContext>({
  createdAt: async () => new Date().toISOString(),
})

// Schema for updating existing entries, making all properties optional
export const seraphEventPatchSchema = Type.Partial(seraphEventDataSchema, {
  $id: 'SeraphEventPatch',
})
export type SeraphEventPatch = Static<typeof seraphEventPatchSchema>
export const seraphEventPatchValidator = getDataValidator(
  seraphEventPatchSchema,
  dataValidator
)
export const seraphEventPatchResolver = resolve<ISeraphEvent, HookContext>({})

// Schema for allowed query properties
export const seraphEventQueryProperties = Type.Pick(seraphEventSchema, [
  'id',
  'agentId',
  'projectId',
  'type',
  'createdAt',
])
/**
 * SeraphEvent query schema
 */
export const seraphEventQuerySchema = Type.Intersect(
  [querySyntax(seraphEventQueryProperties)],
  { additionalProperties: true, $id: 'SeraphEventQuery' }
)

export type SeraphEventQuery = Static<typeof seraphEventQuerySchema>

export const seraphEventQueryValidator = getValidator(
  seraphEventQuerySchema,
  queryValidator
)

export const seraphEventQueryResolver = resolve<SeraphEventQuery, HookContext>(
  {}
)

export const seraphEventJsonFields = ['request', 'response']
