import { z } from 'zod'

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

// These are what the portal returns for get/set budget and get user
export const getBudgetResponseSchema = z.object({
  status: z.union([z.literal('success'), z.literal('error')]),
  data: z.any(), // Replace with more specific type if possible
  message: z.string().optional(),
})

export const setBudgetResponseSchema = z.object({
  status: z.union([z.literal('success'), z.literal('error')]),
  message: z.string(),
})

export const getUserResponseSchema = z.object({
  status: z.union([z.literal('success'), z.literal('error')]),
  user: z
    .object({
      id: z.string(),
      email: z.string().email().nullable(),
      name: z.string().nullable(),
      balance: z.number().nullable(),
      promoCredit: z.number().nullable(),
      introCredit: z.number().nullable(),
      hasSubscription: z.boolean(),
      subscriptionName: z.string().nullable(),
    })
    .nullable(),
  message: z.string().optional(),
})
