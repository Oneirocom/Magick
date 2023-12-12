// DOCUMENTED
// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html

// Import necessary helper functions and types
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

export const messageSchemaPrototype = {
  id: Type.String(),
  sender: Type.Optional(Type.String()),
  connector: Type.Optional(Type.String()),
  conversationId: Type.Optional(Type.String()),
  content: Type.String(),
  agentId: Type.String(),
}

// Define the messageSchema
export const messageSchema = Type.Object(messageSchemaPrototype, {
  $id: 'Message',
  additionalProperties: false,
})
export type Message = Static<typeof messageSchema>
export const messageResolver = resolve<Message, HookContext>({})
export const messageExternalResolver = resolve<Message, HookContext>({})

// Define the messageDataSchema to create new entries
export const messageDataSchema = Type.Pick(
  messageSchema,
  [
    'sender',
    'connector',
    'conversationId',
    'content',
    'agentId',
  ],
  {
    $id: 'MessageData',
  }
)
export type MessageData = Static<typeof messageDataSchema>

// Define the messageDataValidator
export const messageDataValidator = getDataValidator(
  messageDataSchema,
  dataValidator
)
export const messageDataResolver = resolve<Message, HookContext>({})

// Define the messagePatchSchema to update existing entries
export const messagePatchSchema = Type.Partial(messageDataSchema, {
  $id: 'MessagePatch',
})
export type MessagePatch = Static<typeof messagePatchSchema>

// Define the messagePatchValidator for messagePatchSchema
export const messagePatchValidator = getDataValidator(
  messagePatchSchema,
  dataValidator
)
export const messagePatchResolver = resolve<Message, HookContext>({})

// Define the messageQueryProperties and messageQuerySchema
export const messageQueryProperties = Type.Pick(messageSchema, [
  'id',
  'sender',
  'connector',
  'conversationId',
  'content',
  'agentId',
])
export const messageQuerySchema = Type.Intersect(
  [
    querySyntax(messageQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false }),
  ],
  { additionalProperties: false }
)

// Define the query validator and resolver for messageQuerySchema
export type MessageQuery = Static<typeof messageQuerySchema>
export const messageQueryValidator = getValidator(
  messageQuerySchema,
  queryValidator
)
export const messageQueryResolver = resolve<MessageQuery, HookContext>({})
