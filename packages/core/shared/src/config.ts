// DOCUMENTED
import { config } from 'dotenv-flow'
import { importMetaEnv } from './import-meta-env'

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

// Define and export constants from environment variables
export const IGNORE_AUTH = getVarForEnvironment('IGNORE_AUTH') === 'true'
export const DATABASE_URL = getVarForEnvironment('DATABASE_URL')
export const DEFAULT_PROJECT_ID =
  getVarForEnvironment('PROJECT_ID') || 'bb1b3d24-84e0-424e-b4f1-57603f307a89'
export const DEFAULT_USER_ID = getVarForEnvironment('USER_ID') || '1234567890'
export const DEFAULT_USER_TOKEN =
  getVarForEnvironment('DUMMY_TOKEN') ||
  'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..rJhmRC7mavFfGntn.kziPBkhPayhfeHdDeFqragytCy8y34VP6QYjupQ5oxwCkierT9us9sBbWUoymezz-KqV8hnp1Fgh_EolLrnP2hprHd2gpFAHlXUfSjToZ4RdtsUdykZ_CG42ThinlWHwM_RdCBs6_GSjd45yM-87UVlouNpijhVN81UfgJr_02OM5AXMbAaVosBQXb-6-U6aPWbfDmMkSW04jJB3z082qXsVIgDLlAcuckMGl7NNXGXYQ4YPuzT5D7H5-z9nZKES7tAnqOvji-AZJkcE8weEe4a9I9dOSR1x0sGPBWNdK5ChcKj46kXiNbGezg7PCAVBjbYneJdJkDeSGSq_gQo-M5Fazo9SoB1l5oo4MlIlGws7Lqv0Zj-re64JarI0HtLv5CBeIww.jYckIGFA16JQMAPRHn2SNQ'
export const PRODUCTION = getVarForEnvironment('PRODUCTION') === 'true'
export const SERVER_PORT = getVarForEnvironment('PORT') || '3030'
export const SERVER_HOST = getVarForEnvironment('HOST') || 'localhost'
export const SPEECH_SERVER_URL =
  getVarForEnvironment('SPEECH_SERVER_URL') || 'http://localhost:65532'
export const TRUSTED_PARENT_URL =
  getVarForEnvironment('TRUSTED_PARENT_URL') || null
export const API_ROOT_URL =
  getVarForEnvironment('API_URL') || `http://localhost:${SERVER_PORT}`
export const GOOGLE_APPLICATION_CREDENTIALS =
  processEnv.GOOGLE_APPLICATION_CREDENTIALS || ''
export const SPEECH_SERVER_PORT =
  getVarForEnvironment('SPEECH_SERVER_PORT') || 65532
export const ENABLE_SPEECH_SERVER =
  getVarForEnvironment('ENABLE_SPEECH_SERVER') || true
export const USSSL_SPEECH = getVarForEnvironment('USSSL_SPEECH') || true
export const FILE_SERVER_PORT =
  getVarForEnvironment('FILE_SERVER_PORT') || 65530
export const FILE_SERVER_URL =
  getVarForEnvironment('FILE_SERVER_URL') || 'https://localhost:65530'
export const USESSL = getVarForEnvironment('USESSL') || false
export const NODE_ENV = getVarForEnvironment('NODE_ENV') || 'development'

export const PAGINATE_DEFAULT = getVarForEnvironment('PAGINATE_DEFAULT') || '10'
export const PAGINATE_MAX = getVarForEnvironment('PAGINATE_MAX') || '100'
export const JWT_SECRET = getVarForEnvironment('JWT_SECRET') || 'secret'

export const POSTHOG_ENABLED =
  getVarForEnvironment('POSTHOG_ENABLED') === 'true'
export const POSTHOG_API_KEY = getVarForEnvironment('POSTHOG_API_KEY') || ''
export const REDISCLOUD_URL = getVarForEnvironment('REDISCLOUD_URL') || ''

export const ELEVENLABS_API_KEY =
  getVarForEnvironment('ELEVENLABS_API_KEY') ||
  'ce69df07b50e7179cbbfc5c2bef9d752'
export const VITE_APP_TRUSTED_PARENT_URL =
  getVarForEnvironment('VITE_APP_TRUSTED_PARENT_URL') || ''
