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
import { GenerationSchema, generationSchema } from '@magickml/core'

/**
 * Generation resolver
 */
export const generationResolver = resolve<GenerationSchema, HookContext>({})

/**
 * Generation data schema for creating new entries
 */
export const generationDataSchema = Type.Pick(
  generationSchema,
  ['projectId', 'modelName', 'description', 'outputPaths', 'type', 'createdAt'],
  { $id: 'GenerationData' }
)

/**
 * Generation patch data schema for updating entries
 */
export const generationPatchDataSchema = Type.Pick(
  generationSchema,
  [
    'id',
    'modelName',
    'projectId',
    'description',
    'outputPaths',
    'type',
    'deletedAt',
  ],
  { $id: 'GenerationPatch', additionalProperties: false }
)
/**
 * Generation data type
 */
export type GenerationData = Static<typeof generationDataSchema>

/**
 * Generation data validator
 */
export const generationDataValidator = getDataValidator(
  generationDataSchema,
  dataValidator
)

/**
 * Generation patch type
 */
export type GenerationPatch = Static<typeof generationPatchDataSchema>

/**
 * Generation patch validator
 */
export const generationPatchValidator = getDataValidator(
  generationPatchDataSchema,
  dataValidator
)

/**
 * Generation allowed query properties
 */
export const generationQueryProperties = Type.Pick(generationSchema, [
  'id',
  'projectId',
  'modelName',
  'description',
  'outputPaths',
  'type',
  'createdAt',
  'deletedAt',
])

/**
 * Generation query schema
 */
export const generationQuerySchema = Type.Intersect(
  [querySyntax(generationQueryProperties)],
  { additionalProperties: false }
)

/**
 * Generation query type
 */
export type GenerationQuery = Static<typeof generationQuerySchema>

/**
 * Generation query validator
 */
export const generationQueryValidator = getValidator(
  generationQuerySchema,
  queryValidator
)

/**
 * JSON fields for generations
 */
export const generationJsonFields = ['data']
