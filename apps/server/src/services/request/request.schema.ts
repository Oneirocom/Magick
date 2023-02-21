// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getDataValidator, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

// Main data model schema
export const requestSchema = Type.Object(
  {
    id: Type.String(),
    projectId: Type.String(),
    requestData: Type.String(),
    responseData: Type.Optional(Type.String()),
    duration: Type.Optional(Type.Number()),
    status: Type.Optional(Type.String()),
    statusCode: Type.Optional(Type.Number()),
    created_at: Type.Optional(Type.Number()),
    provider: Type.String(),
    model: Type.Optional(Type.String()),
    parameters: Type.Optional(Type.String()),
    type: Type.String(),
    hidden: Type.Boolean(),
    processed: Type.Boolean(),
    cost: Type.Optional(Type.Number()),
  },
  { $id: 'Request', additionalProperties: false }
)
export type Request = Static<typeof requestSchema>
export const requestResolver = resolve<Request, HookContext>({})

export const requestExternalResolver = resolve<Request, HookContext>({})

// Schema for creating new entries
export const requestDataSchema = Type.Pick(requestSchema, [
  'id',
  'projectId',
  'requestData',
  'responseData',
  'duration',
  'status',
  'model',
  'parameters',
  'statusCode',
  'created_at',
  'provider',
  'type',
  'hidden',
  'processed',
  'cost',
], {
  $id: 'RequestData'
})
export type RequestData = Static<typeof requestDataSchema>
export const requestDataValidator = getDataValidator(requestDataSchema, dataValidator)
export const requestDataResolver = resolve<Request, HookContext>({})

// Schema for updating existing entries
export const requestPatchSchema = Type.Partial(requestDataSchema, {
  $id: 'RequestPatch'
})
export type RequestPatch = Static<typeof requestPatchSchema>
export const requestPatchValidator = getDataValidator(requestPatchSchema, dataValidator)
export const requestPatchResolver = resolve<Request, HookContext>({})

// Schema for allowed query properties
export const requestQueryProperties = Type.Pick(requestSchema, [
  'id',
  'projectId',
  'requestData',
  'responseData',
  'model',
  'parameters',
  'duration',
  'status',
  'statusCode',
  'created_at',
  'provider',
  'type',
  'hidden',
  'processed',
  'cost',
])
export const requestQuerySchema = Type.Intersect(
  [
    querySyntax(requestQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type RequestQuery = Static<typeof requestQuerySchema>
export const requestQueryValidator = getValidator(requestQuerySchema, queryValidator)
export const requestQueryResolver = resolve<RequestQuery, HookContext>({})
