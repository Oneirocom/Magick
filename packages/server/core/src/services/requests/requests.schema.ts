// DOCUMENTED
// This file contains schemas and validators for the Request model.
// For more information about this file, see https://dove.feathersjs.com/guides/cli/service.schemas.html
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
 * Main data model schema for Request entities.
 */
export const requestSchema = Type.Object(
  {
    id: Type.String(),
    projectId: Type.String(),
    agentId: Type.String(),
    requestData: Type.String(),
    responseData: Type.Optional(Type.String()),
    duration: Type.Optional(Type.Number()),
    status: Type.Optional(Type.String()),
    statusCode: Type.Optional(Type.Number()),
    createdAt: Type.Optional(Type.String()),
    provider: Type.String(),
    model: Type.Optional(Type.String()),
    parameters: Type.Optional(Type.String()),
    type: Type.String(),
    hidden: Type.Boolean(),
    processed: Type.Boolean(),
    cost: Type.Optional(Type.Number()),
    spell: Type.Optional(Type.String()),
    nodeId: Type.Optional(Type.Number()),
  },
  { $id: 'Request', additionalProperties: false }
)
export type Request = Static<typeof requestSchema>
export const requestResolver = resolve<Request, HookContext>({})

export const requestExternalResolver = resolve<Request, HookContext>({})

/**
 * Schema for creating new Request entities.
 */
export const requestDataSchema = Type.Pick(
  requestSchema,
  [
    'id',
    'projectId',
    'agentId',
    'requestData',
    'responseData',
    'duration',
    'status',
    'model',
    'parameters',
    'statusCode',
    'createdAt',
    'provider',
    'type',
    'hidden',
    'processed',
    'cost',
    'spell',
    'nodeId',
  ],
  {
    $id: 'RequestData',
  }
)
export type RequestData = Static<typeof requestDataSchema>
export const requestDataValidator = getDataValidator(
  requestDataSchema,
  dataValidator
)
export const requestDataResolver = resolve<Request, HookContext>({})

/**
 * Schema for updating existing Request entities.
 */
export const requestPatchSchema = Type.Partial(requestDataSchema, {
  $id: 'RequestPatch',
})
export type RequestPatch = Static<typeof requestPatchSchema>
export const requestPatchValidator = getDataValidator(
  requestPatchSchema,
  dataValidator
)
export const requestPatchResolver = resolve<Request, HookContext>({})

/**
 * Schema for allowed query properties for Request entities.
 */
export const requestQueryProperties = Type.Pick(requestSchema, [
  'id',
  'projectId',
  'agentId',
  'requestData',
  'responseData',
  'model',
  'parameters',
  'duration',
  'status',
  'statusCode',
  'createdAt',
  'provider',
  'type',
  'hidden',
  'processed',
  'cost',
  'spell',
  'nodeId',
])
export const requestQuerySchema = Type.Intersect(
  [
    querySyntax(requestQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false }),
  ],
  { additionalProperties: false }
)
export type RequestQuery = Static<typeof requestQuerySchema>
export const requestQueryValidator = getValidator(
  requestQuerySchema,
  queryValidator
)
export const requestQueryResolver = resolve<RequestQuery, HookContext>({})
