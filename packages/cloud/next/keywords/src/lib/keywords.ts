type ProxyUser = {
  id: string
  name: string
  customer_identifier: string
  created_at: string
  last_active: string
  top_models: {}
  email: string
  period_start: string
  period_end: string
  budget_duration: string
  period_budget: number
  total_budget: number
  total_usage: number
  total_period_usage: number
  organization: number
}

type Model = {
  model_name: string
  display_name: string
  max_context_window: number
  input_cost: number
  output_cost: number
  rate_limit: number
  provider: {
    provider_name: string
    provider_id: string
    api_key: string
    moderation: 'Filtered'
    extra_kwargs: any
  }
}

export class KeywordsService {
  private readonly apiUrl: string
  private readonly apiKey: string

  constructor() {
    this.apiUrl = process.env['KEYWORDS_API_URL'] || ''
    this.apiKey = process.env['KEYWORDS_API_KEY'] || ''
  }

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    }
  }

  async fetchProxyWallet(proxyId: string): Promise<ProxyUser> {
    try {
      const options: RequestInit = {
        method: 'GET',
        headers: this.getHeaders(),
      }
      return await fetch(
        `${this.apiUrl}/api/user/detail/${proxyId}`,
        options
      ).then(res => res.json())
    } catch (error) {
      console.error('Error fetching proxy wallet:', error)
      throw error
    }
  }

  groupModelsByProvider(models: Model[]) {
    const providers: Record<
      string,
      { models: Model[]; apiKey: string; providerName: string }
    > = {}
    for (const model of models) {
      const providerId = model.provider.provider_id
      const providerName = model.provider.provider_name
      const providerKey = model.provider.api_key

      if (!providers[providerId]) {
        providers[providerId] = {
          apiKey: providerKey,
          providerName: providerName,
          models: [],
        }
      }
      providers[providerId].models.push(model)
    }
    return providers
  }

  async updateProxyWallet(proxyId: string, data: any): Promise<ProxyUser> {
    try {
      const options: RequestInit = {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      }
      return await fetch(
        `${this.apiUrl}/api/user/update/${proxyId}`,
        options
      ).then(res => res.json())
    } catch (error) {
      console.error('Error updating proxy wallet:', error)
      throw error
    }
  }

  async fetchProxyWallets(userId: string): Promise<{
    mpUser: ProxyUser | null
    walletUser: ProxyUser | null
  }> {
    try {
      const options: RequestInit = {
        method: 'GET',
        headers: this.getHeaders(),
      }
      const [mpUser, walletUser] = await Promise.all([
        fetch(`${this.apiUrl}/api/user/detail/MP_${userId}`, options).then(
          res => res.json()
        ) as Promise<ProxyUser>,
        fetch(`${this.apiUrl}/api/user/detail/WALLET_${userId}`, options).then(
          res => res.json()
        ) as Promise<ProxyUser>,
      ])

      if (!mpUser.period_end || !walletUser.period_end) {
        await this.ensurePeriodBudget({ mpUser, walletUser })
      }

      if (mpUser.customer_identifier && walletUser.customer_identifier) {
        return { mpUser, walletUser }
      }
      return { mpUser: null, walletUser: null }
    } catch (error) {
      console.error('Error fetching proxy wallets:', error)
      throw error
    }
  }

  async createWalletUsers(userId: string) {
    try {
      const options: RequestInit = {
        method: 'POST',
        headers: this.getHeaders(),
      }
      const [mpUser, walletUser] = await Promise.all([
        fetch(`${this.apiUrl}/api/user/create/MP_${userId}`, options).then(
          res => res.json()
        ) as Promise<ProxyUser>,
        fetch(`${this.apiUrl}/api/user/create/WALLET_${userId}`, options).then(
          res => res.json()
        ) as Promise<ProxyUser>,
      ])

      if (!mpUser.customer_identifier || !walletUser.customer_identifier)
        throw new Error('Error creating wallet users')

      return { mpUser, walletUser }
    } catch (error) {
      console.error('Error creating wallet users:', error)
      throw error
    }
  }

  async createWalletUser(proxyUser: string, data: any) {
    try {
      const options: RequestInit = {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      }
      return await fetch(`${this.apiUrl}/api/user/create/`, options).then(res =>
        res.json()
      )
    } catch (error) {
      console.error('Error creating wallet user:', error)
      throw error
    }
  }

  async ensurePeriodBudget({
    mpUser,
    walletUser,
  }: {
    mpUser: ProxyUser
    walletUser: ProxyUser
  }) {
    try {
      if (mpUser.period_budget === undefined) {
        await fetch(
          `${this.apiUrl}/api/user/update/${mpUser.customer_identifier}`,
          {
            method: 'PATCH',
            headers: this.getHeaders(),
            body: JSON.stringify({
              period_budget: 0,
            }),
          }
        )
      }
      if (walletUser.period_budget === undefined) {
        await fetch(
          `${this.apiUrl}/api/user/update/${walletUser.customer_identifier}`,
          {
            method: 'PATCH',
            headers: this.getHeaders(),
            body: JSON.stringify({
              period_budget: 0,
            }),
          }
        )
      }
    } catch (error) {
      console.error('Error ensuring period budget:', error)
      throw error
    }
  }

  async fetchModels() {
    const response = await fetch(`${this.apiUrl}/api/models/public`)
    const data = await response.json()
    const { models } = data
    return this.groupModelsByProvider(models)
  }

  async handleSubscriptionRenewal({
    userId,
    subscriptionName,
  }: {
    userId: string
    subscriptionName: string
  }): Promise<ProxyUser | null> {
    const isWizard = subscriptionName === 'WIZARD'
    let mpUser: ProxyUser
    if (isWizard) {
      mpUser = await this.fetchProxyWallet(`MP_${userId}`)

      if (!mpUser.customer_identifier) {
        throw new Error('User proxy data not found')
      }

      mpUser = await this.updateProxyWallet(`MP_${userId}`, {
        period_budget: 10,
        period_start: new Date().toISOString(),
        budget_duration: 'monthly',
      })

      if (!mpUser.customer_identifier) {
        throw new Error('Failed to update mp user')
      }
      return mpUser
    }
    return null
  }

  async handleSubscriptionCancellation({
    userId,
    subscriptionName,
  }: {
    userId: string
    subscriptionName: string
  }) {
    const isWizard = subscriptionName === 'WIZARD'
    if (isWizard) {
      const mpUser = await this.fetchProxyWallet(`MP_${userId}`)

      if (!mpUser.customer_identifier) {
        throw new Error('User proxy data not found')
      }

      const updatedMpUser = await this.updateProxyWallet(`MP_${userId}`, {
        period_budget: 0,
        period_start: new Date().toISOString(),
        budget_duration: 'monthly',
      })

      if (!updatedMpUser.customer_identifier) {
        throw new Error('Failed to update mp user')
      }
    }
  }
}
