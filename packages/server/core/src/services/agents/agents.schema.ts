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
import { agentSchema } from 'server/schemas'

/**
 * Agent type
 */
export type Agent = Static<typeof agentSchema>

/**
 * Agent resolver
 */
export const agentResolver = resolve<Agent, HookContext>({})

/**
 * External agent resolver
 */
export const agentExternalResolver = resolve<Agent, HookContext>({})

/**
 * Agent data schema for creating new entries
 */
export const agentDataSchema = Type.Pick(
  agentSchema,
  [
    'projectId',
    'name',
    'enabled',
    'updatedAt',
    'pingedAt',
    'data',
    'publicVariables',
    'secrets',
    'rootSpellId',
    'default',
  ],
  { $id: 'AgentData' }
)

/**
 * Agent patch data schema for creating new entries
 */
export const agentPatchDataSchema = Type.Pick(
  agentSchema,
  [
    'id',
    'name',
    'projectId',
    'enabled',
    'runState',
    'updatedAt',
    'pingedAt',
    'data',
    'publicVariables',
    'secrets',
  ],
  { $id: 'AgentPatch', additionalProperties: true }
)

/**
 * Agent data type
 */
export type AgentData = Static<typeof agentDataSchema>

/**
 * Agent data validator
 */
export const agentDataValidator = getDataValidator(
  agentDataSchema,
  dataValidator
)

/**
 * Agent data resolver
 */
export const agentDataResolver = resolve<Agent, HookContext>({})

/**
 * Agent patch type
 */
export type AgentPatch = Static<typeof agentPatchDataSchema>

/**
 * Agent patch validator
 */
export const agentPatchValidator = getDataValidator(
  agentPatchDataSchema,
  dataValidator
)

/**
 * Agent patch resolver
 */
export const agentPatchResolver = resolve<Agent, HookContext>({})

/**
 * Agent allowed query properties
 */
export const agentQueryProperties = Type.Pick(agentSchema, [
  'id',
  'projectId',
  'enabled',
  'runState',
  'name',
  'updatedAt',
  'pingedAt',
  'data',
  'publicVariables',
  'secrets',
  'image',
  'rootSpellId',
  'default',
])

/**
 * Agent query schema
 */
export const agentQuerySchema = Type.Intersect(
  [querySyntax(agentQueryProperties)],
  { additionalProperties: false }
)

/**
 * Agent query type
 */
export type AgentQuery = Static<typeof agentQuerySchema>

/**
 * Agent query validator
 */
export const agentQueryValidator = getValidator(
  agentQuerySchema,
  queryValidator
)

/**
 * Agent query resolver
 */
export const agentQueryResolver = resolve<AgentQuery, HookContext>({})

/**
 * JSON fields for agents
 */
export const agentJsonFields = ['data']
