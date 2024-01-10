import { CLOUD_AGENT_KEY, PORTAL_URL } from 'shared/config'

interface User {
  id: string
}
interface IUserService {
  getUserInfo(projectId: string): Promise<User>
  // getUserBudget(userId): Promise<number>
  // getUserBalance(): Promise<number>
  // subtractBalance(amount: number): Promise<void>
}

export class UserService implements IUserService {
  async getUserInfo(projectId: string): Promise<User> {
    const userData = await fetch(`${PORTAL_URL}/api/magick/user`, {
      method: 'POST',
      body: JSON.stringify({
        projectId,
        token: CLOUD_AGENT_KEY,
      }),
    })

    if (!userData.ok) {
      throw new Error('User not found')
    }
    return await userData.json()
  }
}
