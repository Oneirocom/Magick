export const magickApiRootUrl = import.meta.env.PROD
  ? (import.meta.env.VITE_APP_API_ROOT_URL_PROD as string)
  : (import.meta.env.VITE_APP_API_ROOT_URL as string)

export const appRootUrl = import.meta.env.VITE_APP_SITE_ROOT_URL

// coercing this into a boolean
export const feathers = import.meta.env.VITE_APP_FEATHERS === 'true'
export const feathersUrl = 'http://localhost:3030'
export const websocketUrl = 'ws://localhost:8080'
