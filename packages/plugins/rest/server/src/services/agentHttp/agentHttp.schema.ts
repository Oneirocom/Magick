// DOCUMENTED
import { resolve } from '@feathersjs/schema'
import { Type, getValidator } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from 'server/core'
import { dataValidator, queryValidator } from 'server/core'

/**
 * Main data model schema
 */
export const agentHttpSchema = Type.Object(
  {
    spellId: Type.String(),
    agentId: Type.String(),
    content: Type.String(),
    apiKey: Type.String(),
    conversationId: Type.Optional(Type.String()),
    sender: Type.Optional(Type.String()),
    isCloud: Type.Optional(Type.Boolean()),
  },
  { $id: 'AgentHttp', additionalProperties: false }
)

export type AgentHttp = Static<typeof agentHttpSchema>
export const agentHttpValidator = getValidator(agentHttpSchema, dataValidator)
export const agentHttpResolver = resolve<AgentHttp, HookContext>({})

export const agentHttpExternalResolver = resolve<AgentHttp, HookContext>({})

export const agentHttpDataSchema = Type.Object(
  {
    spellId: Type.Optional(Type.String()),
    agentId: Type.String(),
    content: Type.String(),
    isCloud: Type.Optional(Type.Boolean()),
    conversationId: Type.Optional(Type.String()),
    sender: Type.Optional(Type.String()),
  },
  {
    $id: 'AgentHttpData',
  }
)

export type AgentHttpData = Static<typeof agentHttpDataSchema>
export const agentHttpDataValidator = getValidator(
  agentHttpDataSchema,
  dataValidator
)
export const agentHttpDataResolver = resolve<AgentHttp, HookContext>({})

/**
 * Schema for updating existing entries
 */
export const agentHttpPatchSchema = Type.Partial(agentHttpSchema, {
  $id: 'AgentHttpPatch',
})

export type AgentHttpPatch = Static<typeof agentHttpPatchSchema>
export const agentHttpPatchValidator = getValidator(
  agentHttpPatchSchema,
  dataValidator
)
export const agentHttpPatchResolver = resolve<AgentHttp, HookContext>({})

/**
 * Schema for allowed query properties
 */
export const agentHttpQueryProperties = Type.Pick(agentHttpSchema, [
  'agentId',
  'spellId',
  'content',
  'apiKey',
  'isCloud',
  'conversationId',
  'sender',
])

export const agentHttpQuerySchema = Type.Object(
  {
    spellId: Type.Optional(Type.String()),
    content: Type.String(),
    conversationId: Type.Optional(Type.String()),
    sender: Type.Optional(Type.String()),
  },
  { additionalProperties: false }
)

export type AgentHttpQuery = Static<typeof agentHttpQuerySchema>
export const agentHttpQueryValidator = getValidator(
  agentHttpQuerySchema,
  queryValidator
)
export const agentHttpQueryResolver = resolve<AgentHttpQuery, HookContext>({})
