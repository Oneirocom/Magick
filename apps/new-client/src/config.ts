console.log('ENV', import.meta.env)

export const latitudeApiRootUrl =
  import.meta.env.MODE === 'production'
    ? (import.meta.env.VITE_APP_LAPI_ROOT_URL_PROD as string)
    : (import.meta.env.VITE_APP_LAPI_ROOT_URL as string)

export const thothApiRootUrl =
  import.meta.env.MODE === 'production'
    ? (import.meta.env.VITE_APP_API_ROOT_URL_PROD as string)
    : (import.meta.env.VITE_APP_API_ROOT_URL as string)

export const oAuthClientId = import.meta.env.VITE_APP_OAUTH_CLIENT_ID

export const appRootUrl =
  import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_APP_SITE_ROOT_URL_PROD
    : import.meta.env.VITE_APP_SITE_ROOT_URL

export const useLatitude = import.meta.env.VITE_APP_USE_LATITUDE === 'true'
// coercing this into a boolean
export const sharedb = import.meta.env.VITE_APP_SHAREDB === 'true'
export const websockets = import.meta.env.VITE_APP_WEBSOCKETS === 'true'
export const feathers = import.meta.env.VITE_APP_FEATHERS === 'true'
export const feathersUrl = 'http://localhost:3030'
export const websocketUrl = 'ws://localhost:8080'
