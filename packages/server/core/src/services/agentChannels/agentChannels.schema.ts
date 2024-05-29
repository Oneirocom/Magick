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

/**
 * AgentChannel type
 */
export const agentChannelSchema = Type.Object(
  {
    id: Type.String(),
    agentId: Type.String(),
    channelKey: Type.String(),
    channelName: Type.String(),
    initialEvent: Type.Any(),
    channelActive: Type.Boolean(),
    createdAt: Type.String({ format: 'date-time' }),
  },
  { $id: 'AgentChannel' }
)

export type AgentChannel = Static<typeof agentChannelSchema>

/**
 * AgentChannel resolver
 */
export const agentChannelResolver = resolve<AgentChannel, HookContext>({})

/**
 * External agentChannel resolver
 */
export const agentChannelExternalResolver = resolve<AgentChannel, HookContext>(
  {}
)

/**
 * AgentChannel data schema for creating new entries
 */
export const agentChannelDataSchema = Type.Pick(
  agentChannelSchema,
  ['agentId', 'channelKey', 'channelName', 'initialEvent', 'channelActive'],
  { $id: 'AgentChannelData' }
)

export type AgentChannelData = Static<typeof agentChannelDataSchema>

/**
 * AgentChannel data validator
 */
export const agentChannelDataValidator = getDataValidator(
  agentChannelDataSchema,
  dataValidator
)

/**
 * AgentChannel data resolver
 */
export const agentChannelDataResolver = resolve<AgentChannel, HookContext>({})

/**
 * AgentChannel patch schema for updating entries
 */
export const agentChannelPatchSchema = Type.Partial(
  Type.Pick(agentChannelSchema, [
    'channelName',
    'initialEvent',
    'channelActive',
  ]),
  { $id: 'AgentChannelPatch' }
)

export type AgentChannelPatch = Static<typeof agentChannelPatchSchema>

/**
 * AgentChannel patch validator
 */
export const agentChannelPatchValidator = getDataValidator(
  agentChannelPatchSchema,
  dataValidator
)

/**
 * AgentChannel patch resolver
 */
export const agentChannelPatchResolver = resolve<AgentChannel, HookContext>({})

/**
 * AgentChannel query properties
 */
export const agentChannelQueryProperties = Type.Pick(agentChannelSchema, [
  'id',
  'agentId',
  'channelKey',
  'channelName',
  'initialEvent',
  'channelActive',
  'createdAt',
])

/**
 * AgentChannel query schema
 */
export const agentChannelQuerySchema = Type.Intersect(
  [querySyntax(agentChannelQueryProperties)],
  { additionalProperties: false }
)

export type AgentChannelQuery = Static<typeof agentChannelQuerySchema>

/**
 * AgentChannel query validator
 */
export const agentChannelQueryValidator = getValidator(
  agentChannelQuerySchema,
  queryValidator
)

/**
 * AgentChannel query resolver
 */
export const agentChannelQueryResolver = resolve<
  AgentChannelQuery,
  HookContext
>({})

/**
 * AgentChannel JSON fields
 */
export const agentChannelJsonFields = ['initialEvent']
