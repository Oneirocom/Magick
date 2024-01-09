interface IUserService {
  getUserInfo(jwt: string): Promise<User>
  getUserBudget(userId): Promise<number>

  getBalance(): Promise<number>
  subtractBalance(amount: number): Promise<void>
}

export class UserService implements IUserService {
  async getUserInfo(): Promise<User> {
    return {
      name: 'John Doe',
      email: '',
    }
  }

  async getUserBudget(userId): Promise<number> {
    const user = await this.getUserInfo()
    if (!user) {
      throw new Error('User not found')
    }

    return user
  }

  constructor() {}
}
