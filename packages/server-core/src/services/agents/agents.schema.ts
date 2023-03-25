// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
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
import { agentSchema } from '@magickml/engine'

export type Agent = Static<typeof agentSchema>
export const agentResolver = resolve<Agent, HookContext>({})

export const agentExternalResolver = resolve<Agent, HookContext>({})

// Schema for creating new entries
export const agentDataSchema = Type.Pick(
  agentSchema,
  [
    'projectId',
    'rootSpell',
    'name',
    'enabled',
    'updatedAt',
    'pingedAt',
    'spells',
    'data',
    'publicVariables',
    'secrets',
  ],
  { $id: 'AgentData' }
)

// Schema for creating new entries
export const agentPatchDataSchema = Type.Pick(
  agentSchema,
  [
    'id',
    'projectId',
    'rootSpell',
    'name',
    'enabled',
    'updatedAt',
    'pingedAt',
    'spells',
    'data',
    'publicVariables',
    'secrets',
  ],
  { $id: 'AgentData', additionalProperties: true }
)
export type AgentData = Static<typeof agentDataSchema>
export const agentDataValidator = getDataValidator(
  agentDataSchema,
  dataValidator
)
export const agentDataResolver = resolve<Agent, HookContext>({})

// Schema for updating existing entries
export const agentPatchSchema = Type.Partial(agentPatchDataSchema, {
  $id: 'AgentPatch',
})
export type AgentPatch = Static<typeof agentPatchSchema>
export const agentPatchValidator = getDataValidator(
  agentPatchSchema,
  dataValidator
)
export const agentPatchResolver = resolve<Agent, HookContext>({})

// Schema for allowed query properties
export const agentQueryProperties = Type.Pick(agentSchema, [
  'id',
  'projectId',
  'rootSpell',
  'enabled',
  'name',
  'updatedAt',
  'pingedAt',
  'spells',
  'data',
  'publicVariables',
  'secrets',
])
export const agentQuerySchema = Type.Intersect(
  [querySyntax(agentQueryProperties)],
  { additionalProperties: false }
)
export type AgentQuery = Static<typeof agentQuerySchema>
export const agentQueryValidator = getValidator(
  agentQuerySchema,
  queryValidator
)
export const agentQueryResolver = resolve<AgentQuery, HookContext>({})
export const agentJsonFields = ['rootSpell', 'spells', 'data']
