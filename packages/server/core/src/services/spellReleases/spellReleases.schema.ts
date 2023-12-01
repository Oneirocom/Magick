// DOCUMENTED
// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
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
import { spellReleaseSchema } from 'shared/core'

/**
 * SpellRelease type
 */
export type SpellRelease = Static<typeof spellReleaseSchema>

/**
 * SpellRelease resolver
 */
export const spellReleaseResolver = resolve<SpellRelease, HookContext>({})

/**
 * External SpellRelease resolver
 */
export const spellReleaseExternalResolver = resolve<SpellRelease, HookContext>(
  {}
)

/**
 * SpellRelease data schema for creating new entries
 */
export const spellReleaseDataSchema = Type.Pick(
  spellReleaseSchema,
  ['spellId', 'version'],
  { $id: 'SpellReleaseData' }
)

/**
 * SpellRelease patch data schema for creating new entries
 */
export const spellReleasePatchDataSchema = Type.Pick(
  spellReleaseSchema,
  ['id', 'spellId', 'version', 'createdAt'],
  { $id: 'SpellReleasePatch', additionalProperties: true }
)

/**
 * SpellRelease data type
 */
export type SpellReleaseData = Static<typeof spellReleaseDataSchema>

/**
 * SpellRelease data validator
 */
export const spellReleaseDataValidator = getDataValidator(
  spellReleaseDataSchema,
  dataValidator
)

/**
 * SpellRelease data resolver
 */
export const spellReleaseDataResolver = resolve<SpellRelease, HookContext>({})

/**
 * SpellRelease patch type
 */
export type SpellReleasePatch = Static<typeof spellReleasePatchDataSchema>

/**
 * SpellRelease patch validator
 */
export const spellReleasePatchValidator = getDataValidator(
  spellReleasePatchDataSchema,
  dataValidator
)

/**
 * SpellRelease patch resolver
 */
export const spellReleasePatchResolver = resolve<SpellRelease, HookContext>({})

/**
 * SpellRelease allowed query properties
 */
export const spellReleaseQueryProperties = Type.Pick(spellReleaseSchema, [
  'id',
  'spellId',
  'version',
  'createdAt',
])

/**
 * SpellRelease query schema
 */
export const spellReleaseQuerySchema = Type.Intersect(
  [querySyntax(spellReleaseQueryProperties)],
  { additionalProperties: false }
)

/**
 * SpellRelease query type
 */
export type SpellReleaseQuery = Static<typeof spellReleaseQuerySchema>

/**
 * SpellRelease query validator
 */
export const spellReleaseQueryValidator = getValidator(
  spellReleaseQuerySchema,
  queryValidator
)

/**
 * SpellRelease query resolver
 */
export const spellReleaseQueryResolver = resolve<
  SpellReleaseQuery,
  HookContext
>({})

/**
 * JSON fields for SpellReleases
 */
export const spellReleaseJsonFields = ['data']
