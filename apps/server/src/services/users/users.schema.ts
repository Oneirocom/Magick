// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import {
  Type,
  getDataValidator,
  getValidator,
  querySyntax,
} from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'
import { passwordHash } from '@feathersjs/authentication-local'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

// Main data model schema
export const userSchema = Type.Object(
  {
    id: Type.Number(),
    email: Type.String(),
    password: Type.Optional(Type.String()),
    googleId: Type.Optional(Type.String()),
    facebookId: Type.Optional(Type.String()),
    twitterId: Type.Optional(Type.String()),
    githubId: Type.Optional(Type.String()),
    auth0Id: Type.Optional(Type.String()),
  },
  { $id: 'User', additionalProperties: false }
)
export type User = Static<typeof userSchema>
export const userResolver = resolve<User, HookContext>({})

export const userExternalResolver = resolve<User, HookContext>({
  // The password should never be visible externally
  password: async () => undefined,
})

// Schema for creating new users
export const userDataSchema = Type.Pick(
  userSchema,
  [
    'email',
    'password',
    'googleId',
    'facebookId',
    'twitterId',
    'githubId',
    'auth0Id',
  ],
  { $id: 'UserData', additionalProperties: false }
)
export type UserData = Static<typeof userDataSchema>
export const userDataValidator = getDataValidator(userDataSchema, dataValidator)
export const userDataResolver = resolve<User, HookContext>({
  password: passwordHash({ strategy: 'local' }),
})

// Schema for updating existing users
export const userPatchSchema = Type.Partial(userSchema, {
  $id: 'UserPatch',
})
export type UserPatch = Static<typeof userPatchSchema>
export const userPatchValidator = getDataValidator(
  userPatchSchema,
  dataValidator
)
export const userPatchResolver = resolve<User, HookContext>({
  password: passwordHash({ strategy: 'local' }),
})

// Schema for allowed query properties
export const userQueryProperties = Type.Pick(userSchema, [
  'id',
  'email',
  'googleId',
  'facebookId',
  'twitterId',
  'githubId',
  'auth0Id',
])
export const userQuerySchema = Type.Intersect(
  [
    querySyntax(userQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false }),
  ],
  { additionalProperties: false }
)
export type UserQuery = Static<typeof userQuerySchema>
export const userQueryValidator = getValidator(userQuerySchema, queryValidator)
export const userQueryResolver = resolve<UserQuery, HookContext>({
  // If there is a user (e.g. with authentication), they are only allowed to see their own data
  id: async (value, user, context) => {
    if (context.params.user) {
      return context.params.user.id
    }

    return value
  },
})
