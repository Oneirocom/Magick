// DOCUMENTED
// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html

// Import necessary helper functions and types
import { resolve } from '@feathersjs/schema'
import {
  Type,
  getDataValidator,
  getValidator,
  querySyntax,
} from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../config/validators'

export const eventSchemaPrototype = {
  id: Type.String(),
  type: Type.Optional(Type.String()),
  observer: Type.Optional(Type.String()),
  sender: Type.Optional(Type.String()),
  entities: Type.Optional(Type.Array(Type.String())),
  client: Type.Optional(Type.String()),
  channel: Type.Optional(Type.String()),
  channelType: Type.Optional(Type.String()),
  connector: Type.Optional(Type.String()),
  content: Type.Optional(Type.String()),
  agentId: Type.String(),
  projectId: Type.String(),
  date: Type.Optional(Type.String()),
  embedding: Type.Optional(Type.Any()),
  rawData: Type.Optional(Type.String()),
}

// Define the eventSchema
export const eventSchema = Type.Object(eventSchemaPrototype, {
  $id: 'Event',
  additionalProperties: false,
})
export type Event = Static<typeof eventSchema>
export const eventResolver = resolve<Event, HookContext>({})
export const eventExternalResolver = resolve<Event, HookContext>({})

// Define the eventDataSchema to create new entries
export const eventDataSchema = Type.Pick(
  eventSchema,
  [
    'type',
    'observer',
    'sender',
    'entities',
    'client',
    'channel',
    'channelType',
    'connector',
    'projectId',
    'content',
    'agentId',
    'date',
    'embedding',
    'rawData',
  ],
  {
    $id: 'EventData',
  }
)
export type EventData = Static<typeof eventDataSchema>

// Define the eventDataValidator
export const eventDataValidator = getDataValidator(
  eventDataSchema,
  dataValidator
)
export const eventDataResolver = resolve<Event, HookContext>({})

// Define the eventPatchSchema to update existing entries
export const eventPatchSchema = Type.Partial(eventDataSchema, {
  $id: 'EventPatch',
})
export type EventPatch = Static<typeof eventPatchSchema>

// Define the eventPatchValidator for eventPatchSchema
export const eventPatchValidator = getDataValidator(
  eventPatchSchema,
  dataValidator
)
export const eventPatchResolver = resolve<Event, HookContext>({})

// Define the eventQueryProperties and eventQuerySchema
export const eventQueryProperties = Type.Pick(eventSchema, [
  'id',
  'type',
  'observer',
  'sender',
  'entities',
  'client',
  'channel',
  'channelType',
  'connector',
  'projectId',
  'content',
  'agentId',
  'date',
  'embedding',
  'rawData',
])
export const eventQuerySchema = Type.Intersect(
  [
    querySyntax(eventQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false }),
  ],
  { additionalProperties: false }
)

// Define the query validator and resolver for eventQuerySchema
export type EventQuery = Static<typeof eventQuerySchema>
export const eventQueryValidator = getValidator(
  eventQuerySchema,
  queryValidator
)
export const eventQueryResolver = resolve<EventQuery, HookContext>({})
