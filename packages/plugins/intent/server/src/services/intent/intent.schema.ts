// DOCUMENTED
import { resolve } from '@feathersjs/schema'
import {
  Type,
  getValidator,
  querySyntax,
  getDataValidator,
} from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from 'server/core'
import { dataValidator, queryValidator } from 'server/core'

/**
 * Full data model schema for a document.
 *
 * @property {string} id - The document's ID.
 * @property {string} [type] - The type of the document (optional).
 * @property {string} [content] - The content of the document (optional).
 * @property {string} projectId - The ID of the project that the document belongs to.
 * @property {string} [date] - The date when the document was created (optional).
 * @property {any} [embedding] - The embedding data of the document (optional).
 * @property {any} [metadata] - The embedding data of the document (optional).
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
export const intentResolver = resolve<Intent, HookContext>({})
export const intentExternalResolver = resolve<Intent, HookContext>({})

/**
 * Schema for creating new entries
 */
export const intentDataSchema = Type.Pick(
  intentSchema,
  ['type', 'projectId', 'content', 'date', 'embedding', 'metadata'],
  {
    $id: 'IntentData',
  }
)

export type IntentData = Static<typeof intentDataSchema>
export const intentDataValidator = getDataValidator(
  intentDataSchema,
  dataValidator
)
export const intentDataResolver = resolve<Intent, HookContext>({})

/**
 * Schema for updating existing entries
 */
export const intentPatchSchema = Type.Partial(intentSchema, {
  $id: 'IntentPatch',
})
export type IntentPatch = Static<typeof intentPatchSchema>
export const intentPatchValidator = getDataValidator(
  intentPatchSchema,
  dataValidator
)
export const intentPatchResolver = resolve<Intent, HookContext>({})

export const intentValidator = getValidator(intentSchema, dataValidator)

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
