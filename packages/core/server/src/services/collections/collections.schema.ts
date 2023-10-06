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
import { CollectionSchema, collectionSchema } from '@magickml/core'

/**
 * Collection resolver
 */
export const collectionResolver = resolve<CollectionSchema, HookContext>({})

/**
 * Collection data schema for creating new entries
 */
export const collectionDataSchema = Type.Pick(
  collectionSchema,
  ['projectId', 'name', 'description', 'createdAt', 'updatedAt'],
  { $id: 'CollectionData' }
)

/**
 * Collection patch data schema for updating entries
 */
export const collectionPatchDataSchema = Type.Pick(
  collectionSchema,
  ['id', 'name', 'projectId', 'description', 'updatedAt', 'deletedAt'],
  { $id: 'CollectionPatch', additionalProperties: false }
)

/**
 * Collection data type
 */
export type CollectionData = Static<typeof collectionDataSchema>

/**
 * Collection data validator
 */
export const collectionDataValidator = getDataValidator(
  collectionDataSchema,
  dataValidator
)

/**
 * Collection patch type
 */
export type CollectionPatch = Static<typeof collectionPatchDataSchema>

/**
 * Collection patch validator
 */
export const collectionPatchValidator = getDataValidator(
  collectionPatchDataSchema,
  dataValidator
)

/**
 * Collection allowed query properties
 */
export const collectionQueryProperties = Type.Pick(collectionSchema, [
  'id',
  'projectId',
  'name',
  'description',
  'createdAt',
  'updatedAt',
  'deletedAt',
])

/**
 * Collection query schema
 */
export const collectionQuerySchema = Type.Intersect(
  [querySyntax(collectionQueryProperties)],
  { additionalProperties: false }
)

/**
 * Collection query type
 */
export type CollectionQuery = Static<typeof collectionQuerySchema>

/**
 * Collection query validator
 */
export const collectionQueryValidator = getValidator(
  collectionQuerySchema,
  queryValidator
)

/**
 * JSON fields for collections
 */
export const collectionJsonFields = ['data']
