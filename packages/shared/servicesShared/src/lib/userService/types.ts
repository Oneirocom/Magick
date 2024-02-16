export enum SubscriptionNames {
  Apprentice = 'Apprentice Subscription',
  Wizard = 'Wizard Subscription',
}

interface StripeProduct {
  name: SubscriptionNames
  price: number
  description: string
  features?: string[]
}
export const MagickPlans: Record<SubscriptionNames, StripeProduct> = {
  [SubscriptionNames.Apprentice]: {
    name: SubscriptionNames.Apprentice,
    price: 9.99,
    description: 'Bring your own API keys',
  },
  [SubscriptionNames.Wizard]: {
    name: SubscriptionNames.Wizard,
    price: 24.99,
    description: 'Access to all AI models',
    features: ['All providers'],
  },
}

export interface User {
  id: string
  email: string
  name?: string
  balance: number
  hasSubscription: boolean
  subscriptionName?: SubscriptionNames
  promoCredit: number
  introCredit: number
}

export interface UserResponse {
  status: string
  user: User
  message?: string
}

export interface ICoreUserService {
  getUser(): Promise<UserResponse>
}
