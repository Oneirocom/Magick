import { CLOUD_AGENT_KEY, PORTAL_URL } from 'shared/config'
import { SubscriptionNames } from './types'

interface User {
  id: string
  email: string
  name?: string
  balance: number
  hasSubscription: boolean
  subscriptionName?: SubscriptionNames
}

export interface UserResponse {
  status: string
  user: User
  message?: string
}
export interface ICoreUserService {
  getUser(): Promise<UserResponse>
}

type ConstructorParams = {
  projectId: string
}

export class CoreUserService implements ICoreUserService {
  projectId: string
  constructor({ projectId }: ConstructorParams) {
    this.projectId = projectId
  }
  async getUser(): Promise<UserResponse> {
    const url = `${PORTAL_URL}/api/magick/user/${this.projectId}`
    try {
      const userData: UserResponse = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CLOUD_AGENT_KEY,
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
