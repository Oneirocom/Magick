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
import { RecordSchema, recordSchema } from '@magickml/core'

/**
 * Record resolver
 */
export const recordResolver = resolve<RecordSchema, HookContext>({})

/**
 * Record data schema for creating new entries
 */
export const recordDataSchema = Type.Pick(
  recordSchema,
  ['key', 'collectionId', 'data', 'metadata', 'createdAt', 'updatedAt'],
  { $id: 'RecordData' }
)

/**
 * Record patch data schema for updating entries
 */
export const recordPatchDataSchema = Type.Pick(
  recordSchema,
  ['id', 'key', 'collectionId', 'data', 'metadata', 'updatedAt', 'deletedAt'],
  { $id: 'RecordPatch', additionalProperties: false }
)

/**
 * Record data type
 */
export type RecordData = Static<typeof recordDataSchema>

/**
 * Record data validator
 */
export const recordDataValidator = getDataValidator(
  recordDataSchema,
  dataValidator
)

/**
 * Record patch type
 */
export type RecordPatch = Static<typeof recordPatchDataSchema>

/**
 * Record patch validator
 */
export const recordPatchValidator = getDataValidator(
  recordPatchDataSchema,
  dataValidator
)

/**
 * Record allowed query properties
 */
export const recordQueryProperties = Type.Pick(recordSchema, [
  'id',
  'key',
  'collectionId',
  'data',
  'metadata',
  'createdAt',
  'updatedAt',
  'deletedAt',
])

/**
 * Record query schema
 */
export const recordQuerySchema = Type.Intersect(
  [querySyntax(recordQueryProperties)],
  { additionalProperties: false }
)

/**
 * Record query type
 */
export type RecordQuery = Static<typeof recordQuerySchema>

/**
 * Record query validator
 */
export const recordQueryValidator = getValidator(
  recordQuerySchema,
  queryValidator
)

/**
 * JSON fields for records
 */
export const recordJsonFields = ['data', 'metadata']
