// DOCUMENTED
// Imports core TypeBox, Feathers, and other necessary modules
import { resolve } from '@feathersjs/schema'
import {
  Type,
  getDataValidator,
  getValidator,
  querySyntax,
} from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

// Imports custom module types for working with engineered documents
import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../config/validators'
import { documentSchema } from 'shared/core'

// Definitions for base document schema resolution
export const documentResolver = resolve<Document, HookContext>({})
export const documentExternalResolver = resolve<Document, HookContext>({})

/**
 * @description Schema for creating new entries
 */
export const documentDataSchema = Type.Pick(
  documentSchema,
  ['type', 'projectId', 'content', 'date', 'embedding', 'metadata', 'files'],
  {
    $id: 'DocumentData',
  }
)
export type DocumentData = Static<typeof documentDataSchema>
export const documentDataValidator = getDataValidator(
  documentDataSchema,
  dataValidator
)
export const documentDataResolver = resolve<Document, HookContext>({})

/**
 * @description Schema for updating existing entries
 */
export const documentPatchSchema = Type.Partial(documentDataSchema, {
  $id: 'DocumentPatch',
})
export type DocumentPatch = Static<typeof documentPatchSchema>
export const documentPatchValidator = getDataValidator(
  documentPatchSchema,
  dataValidator
)
export const documentPatchResolver = resolve<Document, HookContext>({})

/**
 * @description Schema for allowed query properties
 */
export const documentQueryProperties = Type.Pick(documentSchema, [
  'id',
  'type',
  'projectId',
  'content',
  'date',
  'embedding',
  'metadata',
  'files',
])
export const documentQuerySchema = Type.Intersect(
  [
    querySyntax(documentQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false }),
  ],
  { additionalProperties: false }
)
export type DocumentQuery = Static<typeof documentQuerySchema>
export const documentQueryValidator = getValidator(
  documentQuerySchema,
  queryValidator
)
export const documentQueryResolver = resolve<DocumentQuery, HookContext>({})
