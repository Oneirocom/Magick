// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { queryValidator } from '../../config/validators'
import { userSchema } from 'server/schemas'
import { Params } from '@feathersjs/feathers'

export type UserParams = Params<UserQuery>

/**
 * User type
 */
export type User = Static<typeof userSchema>

/**
 * User resolver
 */
export const userResolver = resolve<User, HookContext>({})

/**
 * External user resolver
 */
export const userExternalResolver = resolve<User, HookContext>({})

/**
 * User allowed query properties
 */
export const userQueryProps = Type.Pick(userSchema, [
  'id',
  'email',
  'name',
  'balance',
  'hasSubscription',
  'subscriptionName',
  'projectId',
])

/**
 * User query schema
 */
export const userQuerySchema = Type.Intersect([querySyntax(userQueryProps)], {
  additionalProperties: false,
})

/**
 * User query type
 */
export type UserQuery = Static<typeof userQuerySchema>

/**
 * User query validator
 */
export const userQueryValidator = getValidator(userQuerySchema, queryValidator)

/**
 * User query resolver
 */
export const userQueryResolver = resolve<UserQuery, HookContext>({})
