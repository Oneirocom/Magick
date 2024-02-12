// DOCUMENTED

import { importMetaEnv } from './import-meta-env'

// Check whether "process" is defined or not, and assign the appropriate environment object.
const processEnv = typeof process === 'undefined' ? importMetaEnv : process.env

/**
 * Get an environment variable value for the given key.
 *
 * @param {string} env - The key to search for in environment variables.
 * @returns {string | undefined} - The value associated with the key, or undefined if not found.
 */
function getVarForEnvironment(env: string): string | undefined {
  return (
    processEnv[env] || // Check processEnv for env key
    processEnv[`VITE_APP_${env}`] || // Check VITE prefixed env variables
    processEnv[`NEXT_${env}`] || // Check NEXT prefixed env variables
    processEnv[`REACT_${env}`] // Check REACT prefixed env variables
  )
}

// Define and export constants from environment variables
export const DEFAULT_PROJECT_ID =
  getVarForEnvironment('PROJECT_ID') || 'bb1b3d24-84e0-424e-b4f1-57603f307a89'
export const DEFAULT_USER_ID = getVarForEnvironment('USER_ID') || '1234567890'
export const DEFAULT_USER_TOKEN =
  getVarForEnvironment('DUMMY_TOKEN') ||
  'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..v5i3ZOjE6D6i3np7.9EIC2-3ykdKdBWy7QVJwLrtvVJYUS4dJPclH00lYUQr7zJt157MLvkS5Tkz_XUXlnd9PkF7h2_EiMmyzEJbm8QXXFAtNLEAs76RYuCcPtDtXjC-IMb9-Ag-r8Oxq2x1teuyhmVjBNIOqbaw6Q_Rks9ZABsa5AvDr0eTYicp9eHs8BUYQltb0hXfh6nkuNAybdAsyGcXecgHVTgqLAZ6odT3W3VxOy2BXjZq2bnodF4UkHwrGoVgDxVyGux3FFz6lhGjpuKAbQDQWHyqU9jQWjqDMAw93wggeMskWMcGoyopYTqcC0OXAmPBGKYWqnhhoOkcEa3KOX4tSSbjj5HcxaZMAKBJe-ndu2PvCa4weVdV6QHl0cpyctgWTz4E7SHOYMgQF-JKuFbG4HUfR7YKFwgD9HtwGtnUkoL03N6tI4d1v-KU2uqyz75yF-YSRpDjnNReHmCjqaIXsv4rxck5hqa5ax8d1VuXtMucvxFT3QtZlt0oekhzfcOWrQV3QdNqU7cEX_OJ_10w3jlmzXkIsmZOjQqHTErBciYi3-qCMzFMtGiBYFil4aFdaEVtwsNCTqpo-jpU5VzoVHXz6-06xKRDLxfWI9RJIYdsy5kWe0jGiutSU7y-1Iec21Zk4r8u011zhOMetd6GmYoAv_-IgiZlJWUyWAp4xtv7ZFBSOpkQjqUlnFq_VGZvRcEExIVpQBRMfcUbQh3rh9nKpe0x7IolMka37DYSUP7IJf231HxsEP8zH2Nk3IP9-_eEqx9QH11MYvIDWJrQe8ijZWFzBw3lwkHvAyeB3HstAE5gWqnSEJ2wJeOI9aWhH2qpPLLjJsInvKep98CebyA.Mk1hveE9GqVWzgScFPrLCQ'
export const STANDALONE = getVarForEnvironment('STANDALONE') === 'true' || false
export const PRODUCTION = getVarForEnvironment('PRODUCTION') === 'true'

export const TRUSTED_PARENT_URL =
  getVarForEnvironment('TRUSTED_PARENT_URL') || 'https://localhost:4000'
export const PORTAL_URL =
  getVarForEnvironment('PORTAL_URL') || 'http://localhost:4000'
export const SERVER_PORT = getVarForEnvironment('PORT') || '3030'
export const API_ROOT_URL =
  getVarForEnvironment('API_URL') || `http://localhost:${SERVER_PORT}`

export const NODE_ENV = getVarForEnvironment('NODE_ENV') || 'development'

export const POSTHOG_ENABLED =
  getVarForEnvironment('POSTHOG_ENABLED') === 'true'
export const POSTHOG_API_KEY = getVarForEnvironment('POSTHOG_API_KEY') || ''

// Feature flags
export const FEATURE_FLAGS = {
  // Enable the new editor
  COMPOSER_V2: getVarForEnvironment('COMPOSER_V2') === 'true' || false,
}

//frigade config
export const FRIGADE_KEY = getVarForEnvironment('FRIGADE_KEY') || ''

export const PLUGIN_SETTINGS = {
  SLACK_DEVELOPER_MODE: getVarForEnvironment('SLACK_DEVELOPER_MODE') === 'true',
}
