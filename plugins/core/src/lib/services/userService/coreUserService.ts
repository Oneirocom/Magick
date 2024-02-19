import axios from 'axios'
import { ICoreUserService, UserResponse } from 'servicesShared'
import { PORTAL_AGENT_KEY, PORTAL_URL } from 'shared/config'

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
      const userData: UserResponse = await axios
        .get(url, {
          timeout: 5000,
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': PORTAL_AGENT_KEY,
          },
        })
        .then(res => res.data)

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
