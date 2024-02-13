// DOCUMENTED
import { config } from 'dotenv-flow'
import { importMetaEnv } from '../../../client/config/src/lib/import-meta-env'
import { v4 } from 'uuid'

// Load environment variables
config({
  path: '../../../.env.*',
})

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

// depricating
export const SPEECH_SERVER_PORT =
  getVarForEnvironment('SPEECH_SERVER_PORT') || 65532
export const ENABLE_SPEECH_SERVER =
  getVarForEnvironment('ENABLE_SPEECH_SERVER') || true
export const USSSL_SPEECH = getVarForEnvironment('USSSL_SPEECH') || true

// Define and export constants from environment variables

export const DATABASE_URL = getVarForEnvironment('DATABASE_URL')
export const STANDALONE = getVarForEnvironment('STANDALONE') === 'true' || false
export const PRODUCTION = getVarForEnvironment('PRODUCTION') === 'true'
export const DONT_CRASH_ON_ERROR =
  getVarForEnvironment('DONT_CRASH_ON_ERROR') === 'true'
export const SERVER_PORT = getVarForEnvironment('PORT') || '3030'
export const SERVER_HOST = getVarForEnvironment('HOST') || 'localhost'
export const SPEECH_SERVER_URL =
  getVarForEnvironment('SPEECH_SERVER_URL') || 'http://localhost:65532'
export const TRUSTED_PARENT_URL =
  getVarForEnvironment('TRUSTED_PARENT_URL') || 'https://localhost:4000'
export const PORTAL_URL =
  getVarForEnvironment('PORTAL_URL') || 'http://localhost:4000'
export const API_ROOT_URL =
  getVarForEnvironment('API_URL') || `http://${SERVER_HOST}:${SERVER_PORT}`

export const NODE_ENV = getVarForEnvironment('NODE_ENV') || 'development'

export const PAGINATE_DEFAULT = getVarForEnvironment('PAGINATE_DEFAULT') || '10'
export const PAGINATE_MAX = getVarForEnvironment('PAGINATE_MAX') || '100'
export const JWT_SECRET = getVarForEnvironment('JWT_SECRET') || 'secret'

export const POSTHOG_ENABLED =
  getVarForEnvironment('POSTHOG_ENABLED') === 'true'
export const POSTHOG_API_KEY = getVarForEnvironment('POSTHOG_API_KEY') || ''

export const REDIS_URL = getVarForEnvironment('REDIS_URL')

export const PINO_LOG_LEVEL = getVarForEnvironment('PINO_LOG_LEVEL') || 'info'

export const AGENT_RESPONSE_TIMEOUT_MSEC =
  Number(getVarForEnvironment('AGENT_RESPONSE_TIMEOUT_MSEC')) || 120000

export const PORTAL_AGENT_KEY = getVarForEnvironment('PORTAL_AGENT_KEY') || v4()

export const AWS_ACCESS_KEY = getVarForEnvironment('AWS_ACCESS_KEY') || ''
export const AWS_SECRET_KEY = getVarForEnvironment('AWS_SECRET_KEY') || ''
export const AWS_REGION = getVarForEnvironment('AWS_REGION') || ''
export const AWS_BUCKET_NAME = getVarForEnvironment('AWS_BUCKET_NAME') || ''
export const AWS_BUCKET_ENDPOINT =
  getVarForEnvironment('AWS_BUCKET_ENDPOINT') || ''

export const HEARTBEAT_MSEC =
  Number(getVarForEnvironment('HEARTBEAT_MSEC')) || 3000
export const MANAGER_WARM_UP_MSEC =
  Number(getVarForEnvironment('MANAGER_WARM_UP_MSEC')) || 5000

export const API_ACCESS_KEY = getVarForEnvironment('API_ACCESS_KEY') || 'apiKey'

export const CREDENTIALS_ENCRYPTION_KEY =
  getVarForEnvironment('CREDENTIALS_ENCRYPTION_KEY') || 'key'

export const CREDENTIALS_ALGORITHM =
  getVarForEnvironment('CREDENTIALS_ALGORITHM') || 'aes-256-cbc'

export const OPENMETER = {
  enabled: getVarForEnvironment('OPENMETER_ENABLED') === 'true',
  endpoint:
    getVarForEnvironment('OPENMETER_ENDPOINT') || 'http://localhost:8888',
  token: getVarForEnvironment('OPENMETER_TOKEN') || '',
  source: getVarForEnvironment('OPENMETER_SOURCE') || 'cloud-dev',
}

export const PLUGIN_SETTINGS = {
  SLACK_DEVELOPER_MODE: getVarForEnvironment('SLACK_DEVELOPER_MODE') === 'true',
}

export const MAGICK_OPENAI_API_KEY = getVarForEnvironment('OPENAI_API_KEY')
export const MAGICK_GEMINI_API_KEY = getVarForEnvironment('GEMINI_API_KEY')
export const MAGICK_PALM_API_KEY = getVarForEnvironment('PALM_API_KEY')
export const MAGICK_TOGETHERAI_API_KEY =
  getVarForEnvironment('TOGETHERAI_API_KEY')
export const VERTEXAI_PROJECT = getVarForEnvironment('VERTEXAI_PROJECT')
export const VERTEXAI_LOCATION = getVarForEnvironment('VERTEXAI_LOCATION')

export const PINECONE_INDEX_NAME =
  getVarForEnvironment('PINECONE_INDEX_NAME') || 'magick-dev'
