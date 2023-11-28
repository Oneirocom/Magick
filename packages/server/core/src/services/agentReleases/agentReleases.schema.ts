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
import { agentReleaseSchema } from 'shared/core'

/**
 * AgentRelease type
 */
export type AgentRelease = Static<typeof agentReleaseSchema>

/**
 * AgentRelease resolver
 */
export const agentReleaseResolver = resolve<AgentRelease, HookContext>({})

/**
 * External AgentRelease resolver
 */
export const agentReleaseExternalResolver = resolve<AgentRelease, HookContext>({})

/**
 * AgentRelease data schema for creating new entries
 */
export const agentReleaseDataSchema = Type.Pick(
  agentReleaseSchema,
  [
    'agentId',
    'version',
  ],
  { $id: 'AgentReleaseData' }
)

/**
 * AgentRelease patch data schema for creating new entries
 */
export const agentReleasePatchDataSchema = Type.Pick(
  agentReleaseSchema,
  [
    'id',
    'agentId',
    'version',
    'createdAt'
  ],
  { $id: 'AgentReleasePatch', additionalProperties: true }
)

/**
 * AgentRelease data type
 */
export type AgentReleaseData = Static<typeof agentReleaseDataSchema>

/**
 * AgentRelease data validator
 */
export const agentReleaseDataValidator = getDataValidator(
  agentReleaseDataSchema,
  dataValidator
)

/**
 * AgentRelease data resolver
 */
export const agentReleaseDataResolver = resolve<AgentRelease, HookContext>({})

/**
 * AgentRelease patch type
 */
export type AgentReleasePatch = Static<typeof agentReleasePatchDataSchema>

/**
 * AgentRelease patch validator
 */
export const agentReleasePatchValidator = getDataValidator(
  agentReleasePatchDataSchema,
  dataValidator
)

/**
 * AgentRelease patch resolver
 */
export const agentReleasePatchResolver = resolve<AgentRelease, HookContext>({})

/**
 * AgentRelease allowed query properties
 */
export const agentReleaseQueryProperties = Type.Pick(agentReleaseSchema, [
  'id',
  'agentId',
  'version',
  'createdAt'
])

/**
 * AgentRelease query schema
 */
export const agentReleaseQuerySchema = Type.Intersect(
  [querySyntax(agentReleaseQueryProperties)],
  { additionalProperties: false }
)

/**
 * AgentRelease query type
 */
export type AgentReleaseQuery = Static<typeof agentReleaseQuerySchema>

/**
 * AgentRelease query validator
 */
export const agentReleaseQueryValidator = getValidator(
  agentReleaseQuerySchema,
  queryValidator
)

/**
 * AgentRelease query resolver
 */
export const agentReleaseQueryResolver = resolve<AgentReleaseQuery, HookContext>({})

/**
 * JSON fields for AgentReleases
 */
export const agentReleaseJsonFields = ['data']
