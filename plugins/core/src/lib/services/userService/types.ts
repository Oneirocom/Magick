export enum StripeProductNames {
  Apprentice = 'Apprentice MP Subscription',
  Wizard = 'Wizard MP Subscription',
}

interface StripeProduct {
  name: StripeProductNames
  price: number
  description: string
  features?: string[]
}
export const MagickPlans: Record<StripeProductNames, StripeProduct> = {
  [StripeProductNames.Apprentice]: {
    name: StripeProductNames.Apprentice,
    price: 9.99,
    description: 'Bring your own API keys',
  },
  [StripeProductNames.Wizard]: {
    name: StripeProductNames.Wizard,
    price: 24.99,
    description: 'Access to all AI models',
    features: ['All providers'],
  },
}
