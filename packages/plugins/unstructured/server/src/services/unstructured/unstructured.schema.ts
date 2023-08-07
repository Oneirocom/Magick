// DOCUMENTED
import { resolve } from '@feathersjs/schema'
import {
  Type,
  getValidator,
  querySyntax,
  getDataValidator,
} from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '@magickml/server-core'
import { dataValidator, queryValidator } from '@magickml/server-core'

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
export const unstructuredSchema = Type.Object(
  {
    id: Type.String(),
    type: Type.Optional(Type.String()),
    content: Type.Optional(Type.String()),
    projectId: Type.String(),
    date: Type.Optional(Type.String()),
    embedding: Type.Optional(Type.Any()),
    metadata: Type.Optional(Type.Any()),
  },
  { $id: 'Unstructured', additionalProperties: false }
)

export type Unstructured = Static<typeof unstructuredSchema>
export const unstructuredResolver = resolve<Unstructured, HookContext>({})
export const unstructuredExternalResolver = resolve<Unstructured, HookContext>(
  {}
)

/**
 * Schema for creating new entries
 */
export const unstructuredDataSchema = Type.Pick(
  unstructuredSchema,
  ['type', 'projectId', 'content', 'date', 'embedding', 'metadata'],
  {
    $id: 'UnstructuredData',
  }
)

export type UnstructuredData = Static<typeof unstructuredDataSchema>
export const unstructuredDataValidator = getDataValidator(
  unstructuredDataSchema,
  dataValidator
)
export const unstructuredDataResolver = resolve<Unstructured, HookContext>({})

/**
 * Schema for updating existing entries
 */
export const unstructuredPatchSchema = Type.Partial(unstructuredSchema, {
  $id: 'UnstructuredPatch',
})
export type UnstructuredPatch = Static<typeof unstructuredPatchSchema>
export const unstructuredPatchValidator = getDataValidator(
  unstructuredPatchSchema,
  dataValidator
)
export const unstructuredPatchResolver = resolve<Unstructured, HookContext>({})

export const unstructuredValidator = getValidator(
  unstructuredSchema,
  dataValidator
)

/**
 * Schema for allowed query properties
 */
export const unstructuredQueryProperties = Type.Pick(unstructuredSchema, [
  'id',
  'type',
  'projectId',
  'content',
  'date',
  'embedding',
  'metadata',
])

export const unstructuredQuerySchema = Type.Intersect(
  [
    querySyntax(unstructuredQueryProperties),
    Type.Object({}, { additionalProperties: false }),
  ],
  { additionalProperties: false }
)

export type UnstructuredQuery = Static<typeof unstructuredQuerySchema>
export const unstructuredQueryValidator = getValidator(
  unstructuredQuerySchema,
  queryValidator
)
export const unstructuredQueryResolver = resolve<
  UnstructuredQuery,
  HookContext
>({})
