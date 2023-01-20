export const magickApiRootUrl = import.meta.env.VITE_APP_API_URL as string

// coercing this into a boolean
export const feathers = import.meta.env.VITE_APP_FEATHERS === 'true'
export const feathersUrl = 'http://localhost:3030'
export const websocketUrl = 'ws://localhost:8080'
