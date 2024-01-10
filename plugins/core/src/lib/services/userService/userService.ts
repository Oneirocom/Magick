import { CLOUD_AGENT_KEY, PORTAL_URL } from 'shared/config'

interface User {
  id: string
  email: string
  name: string
}
interface IUserService {
  getUser(projectId: string): Promise<User>
}

export class UserService implements IUserService {
  async getUser(projectId: string): Promise<User> {
    const userData: User = await fetch(`${PORTAL_URL}/api/magick/user`, {
      method: 'POST',
      body: JSON.stringify({
        projectId,
        token: CLOUD_AGENT_KEY,
      }),
    }).then(res => res.json())

    if (!userData) {
      throw new Error('User not found')
    }
    return userData
  }
}
