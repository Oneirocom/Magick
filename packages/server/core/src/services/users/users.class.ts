import type { Params } from '@feathersjs/feathers'
import type { Application } from '../../declarations'
import { PORTAL_AGENT_KEY, PORTAL_URL } from '@magickml/server-config'
import { UserQuery } from './users.schema'
import { UserResponse } from '@magickml/shared-services'

export type UserParams = Params<UserQuery>

export class UserService<ServiceParams extends UserParams> {
  app: Application

  constructor(app: Application) {
    this.app = app
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async get(projectId: string, params?: ServiceParams) {
    // Custom logic to find a user based on the provided query
    const url = `${PORTAL_URL}/api/magick/user/${projectId}`
    try {
      const userData: UserResponse = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': PORTAL_AGENT_KEY,
        },
      }).then(res => res.json())

      if (!userData) {
        throw new Error('User not found')
      }
      return userData
    } catch (error: any) {
      console.error('Error getting user:', error)
      throw error
    }
  }
}
