// DOCUMENTED
import { resolve } from '@feathersjs/schema'
import { Type, getValidator } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '@magickml/server-core'
import { dataValidator, queryValidator } from '@magickml/server-core'

/**
 * Main data model schema
 */
export const apiSchema = Type.Object(
  {
    spellId: Type.String(),
    agentId: Type.String(),
    content: Type.String(),
    apiKey: Type.String(),
    isCloud: Type.Optional(Type.Boolean()),
  },
  { $id: 'Api', additionalProperties: false }
)

export type Api = Static<typeof apiSchema>
export const apiValidator = getValidator(apiSchema, dataValidator)
export const apiResolver = resolve<Api, HookContext>({})

export const apiExternalResolver = resolve<Api, HookContext>({})

export const apiDataSchema = Type.Object(
  {
    spellId: Type.Optional(Type.String()),
    agentId: Type.String(),
    content: Type.String(),
    isCloud: Type.Optional(Type.Boolean()),
  },
  {
    $id: 'ApiData',
  }
)

export type ApiData = Static<typeof apiDataSchema>
export const apiDataValidator = getValidator(apiDataSchema, dataValidator)
export const apiDataResolver = resolve<Api, HookContext>({})

/**
 * Schema for updating existing entries
 */
export const apiPatchSchema = Type.Partial(apiSchema, {
  $id: 'ApiPatch',
})

export type ApiPatch = Static<typeof apiPatchSchema>
export const apiPatchValidator = getValidator(apiPatchSchema, dataValidator)
export const apiPatchResolver = resolve<Api, HookContext>({})

/**
 * Schema for allowed query properties
 */
export const apiQueryProperties = Type.Pick(apiSchema, [
  'agentId',
  'spellId',
  'content',
  'apiKey',
  'isCloud',
])

export const apiQuerySchema = Type.Object(
  {
    spellId: Type.Optional(Type.String()),
    content: Type.String(),
  },
  { additionalProperties: false }
)

export type ApiQuery = Static<typeof apiQuerySchema>
export const apiQueryValidator = getValidator(apiQuerySchema, queryValidator)
export const apiQueryResolver = resolve<ApiQuery, HookContext>({})
