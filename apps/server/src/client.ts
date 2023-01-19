// For more information about this file see https://dove.feathersjs.com/guides/cli/client.html
import { feathers } from '@feathersjs/feathers'
import type { TransportConnection, Params } from '@feathersjs/feathers'
import authenticationClient from '@feathersjs/authentication-client'
import type { AuthenticationClientOptions } from '@feathersjs/authentication-client'
import type {
  User,
  UserData,
  UserQuery,
  UserService,
} from './services/users/users'
export type { User, UserData, UserQuery }
export const userServiceMethods = [
  'find',
  'get',
  'create',
  'patch',
  'remove',
] as const
export type UserClientService = Pick<
  UserService<Params<UserQuery>>,
  (typeof userServiceMethods)[number]
>

export interface ServiceTypes {
  users: UserClientService
  //
}

/**
 * Returns a typed client for the server app.
 *
 * @param connection The REST or Socket.io Feathers client connection
 * @param authenticationOptions Additional settings for the authentication client
 * @see https://dove.feathersjs.com/api/client.html
 * @returns The Feathers client application
 */
export const createClient = <Configuration = any>(
  connection: TransportConnection<ServiceTypes>,
  authenticationOptions: Partial<AuthenticationClientOptions> = {}
) => {
  const client = feathers<ServiceTypes, Configuration>()

  client.configure(connection)
  client.configure(authenticationClient(authenticationOptions))

  client.use('users', connection.service('users'), {
    methods: userServiceMethods,
  })
  return client
}
