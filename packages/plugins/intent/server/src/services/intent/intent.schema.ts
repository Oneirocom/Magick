// DOCUMENTED
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '@magickml/server-core'
import { dataValidator, queryValidator } from '@magickml/server-core'

/**
 * Main data model schema
 */
export const intentSchema = Type.Object(
  {
    id: Type.String(),
    type: Type.Optional(Type.String()),
    content: Type.Optional(Type.String()),
    projectId: Type.String(),
    date: Type.Optional(Type.String()),
    embedding: Type.Optional(Type.Any()),
    metadata: Type.Optional(Type.Any()),
  },
  { $id: 'Intent', additionalProperties: false }
)

export type Intent = Static<typeof intentSchema>
export const intentValidator = getValidator(intentSchema, dataValidator)
export const intentResolver = resolve<Intent, HookContext>({})

export const intentExternalResolver = resolve<Intent, HookContext>({})

/**
 * Schema for creating new entries
 */
export const intentDataSchema = Type.Pick(
  intentSchema,
  ['type', 'projectId', 'content', 'date', 'embedding', 'metadata'],
  {
    $id: 'Intent',
  }
)

export type IntentData = Static<typeof intentDataSchema>
export const intentDataValidator = getValidator(intentDataSchema, dataValidator)
export const intentDataResolver = resolve<Intent, HookContext>({})

/**
 * Schema for updating existing entries
 */
export const intentPatchSchema = Type.Partial(intentSchema, {
  $id: 'IntentPatch',
})

export type IntentPatch = Static<typeof intentPatchSchema>
export const intentPatchValidator = getValidator(
  intentPatchSchema,
  dataValidator
)
export const intentPatchResolver = resolve<Intent, HookContext>({})

/**
 * Schema for allowed query properties
 */
export const intentQueryProperties = Type.Pick(intentSchema, [
  'id',
  'type',
  'projectId',
  'content',
  'date',
  'embedding',
  'metadata',
])

export const intentQuerySchema = Type.Intersect(
  [
    querySyntax(intentQueryProperties),
    Type.Object({}, { additionalProperties: false }),
  ],
  { additionalProperties: false }
)

export type IntentQuery = Static<typeof intentQuerySchema>
export const intentQueryValidator = getValidator(
  intentQuerySchema,
  queryValidator
)
export const intentQueryResolver = resolve<IntentQuery, HookContext>({})
