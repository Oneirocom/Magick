// KNOWLEDGEED
// Imports core TypeBox, Feathers, and other necessary modules
import { resolve } from '@feathersjs/schema'
import {
  Type,
  getDataValidator,
  getValidator,
  querySyntax,
} from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

// Imports custom module types for working with engineered knowledge
import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../config/validators'
import { knowledgeSchema } from 'server/schemas'

export type Knowledge = Static<typeof knowledgeSchema>

// Definitions for base knowledge schema resolution
export const knowledgeResolver = resolve<Knowledge, HookContext>({})
export const knowledgeExternalResolver = resolve<Knowledge, HookContext>({})

/**
 * @description Schema for creating new entries
 */
export const knowledgeDataSchema = Type.Pick(
  knowledgeSchema,
  [
    'projectId',
    'type',
    'dataType',
    'metadata',
    'sourceUrl',
    'memoryId',
    'name',
  ],
  {
    $id: 'KnowledgeData',
  }
)
export type KnowledgeData = Static<typeof knowledgeDataSchema> & {
  files?: any
  tag?: string
}

export const knowledgeDataValidator = getDataValidator(
  knowledgeDataSchema,
  dataValidator
)
export const knowledgeDataResolver = resolve<Knowledge, HookContext>({})

/**
 * @description Schema for updating existing entries
 */
export const knowledgePatchSchema = Type.Partial(knowledgeDataSchema, {
  $id: 'KnowledgePatch',
})

export type KnowledgePatch = Static<typeof knowledgePatchSchema>
export const knowledgePatchValidator = getDataValidator(
  knowledgePatchSchema,
  dataValidator
)
export const knowledgePatchResolver = resolve<Knowledge, HookContext>({})

/**
 * @description Schema for allowed query properties
 */
export const knowledgeQueryProperties = Type.Pick(knowledgeSchema, [
  'id',
  'type',
  'projectId',
  'name',
  'metadata',
  'memoryId',
  'dataType',
])
export const knowledgeQuerySchema = Type.Intersect(
  [
    querySyntax(knowledgeQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false }),
  ],
  { additionalProperties: false }
)
export type KnowledgeQuery = Static<typeof knowledgeQuerySchema>
export const knowledgeQueryValidator = getValidator(
  knowledgeQuerySchema,
  queryValidator
)
export const knowledgeQueryResolver = resolve<KnowledgeQuery, HookContext>({})
