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
  'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..BN9ADHQdjIBQ58Dq.YwqbTHEPPK1xfkrQWMdiFJe1c0bSne-DZXEikRcgEtirrYv2ljeAeK9MJMBz8O5Azs4kHaFBQYoTltjpGwvbpfPQ8xWpPyc3VphrBYx-skryt7y6bX2STPikc7nHpaWgSJ3QTnh6_tS3e7ciahR3T67sCUvwVnr85rsygEKSFRW48IFtA7vFeRBP20Jq1iSYIVTpbMVVUAAXiefPRBhuvEtl7tB0k16_ogeMkc9KKHIeWkklYcW76DV5-2i1_6mmqgxh9Mqs-rctKsSLn0hg9TKsDMHe2nIRJWty7VWfIW9H8vJOk-5y_4dGAwndnkLeB9W3l0ZXMqPjigQvnbyQix9wesAmKbsdADZWbQCDWY53Sd6TPS_YxV7aQOb3p0GbYvkM2SRnp6a9qbuRXSRzuxKYDw5_milXFZccAdBu7HTyK0f6ZB5exzkdsbspbWyv7YIinrawZgqsuFI8pzID9G_TaqH7GAmp5GLPDBTza57DOn9SwdZSpO6hGTSaDlHLlAbSnuanqvnbSoCcVYn41pDm57aGnoTirXWQiPOPumZwO26olEly5dnLSrpqmuEI_3eJ3V2IJpgF5YpTtSJrmv1S_VzTS6GYk31nynW4jRd73fMZAmQ5CLxAhi1SeUjC9hrRNSF9SAw_zugfI_47BeuJiAozk99ykxiDb7cYO2K2or7UmUdDtCPl7n4nDc2M-QOrWeVeTnOisDZgb_swPklXDi5yzYZD5oq2VHoerQq7mBntqS8O1lAY3zNTPYMA6CQxviHyiKSacH93BYPweTiM6S9HuMGp0RTih2oFMOE8pSAkN_8YNwuo2PotWC7CDFE.BNpe5cClbyunR2Q2JDUGSA'
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
