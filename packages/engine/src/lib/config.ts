import { config } from 'dotenv-flow'
import { importMetaEnv } from './import-meta-env'

config({
  path: '../../../.env.*',
})

// process is not defined on client
const processEnv = typeof process === 'undefined' ? importMetaEnv : process.env

export const SERVER_PORT = processEnv.PORT || 3030
export const VITE_APP_API_URL = processEnv.VITE_APP_API_URL
export const API_ROOT_URL =
  VITE_APP_API_URL ||
  processEnv.API_ROOT_URL ||
  `http://localhost:${SERVER_PORT}`
export const GOOGLE_APPLICATION_CREDENTIALS =
  processEnv.GOOGLE_APPLICATION_CREDENTIALS || ''
export const SPEECH_SERVER_PORT = processEnv.SPEECH_SERVER_PORT || 65532
export const ENABLE_SPEECH_SERVER = processEnv.ENABLE_SPEECH_SERVER || true
export const OPENAI_ENDPOINT =
  processEnv.VITE_OPENAI_ENDPOINT ||
  processEnv.NEXT_OPENAI_ENDPOINT ||
  processEnv.OPENAI_ENDPOINT ||
  null
export const USSSL_SPEECH = processEnv.USSSL_SPEECH || true
export const FILE_SERVER_PORT = processEnv.FILE_SERVER_PORT || 65530
export const FILE_SERVER_URL =
  processEnv.FILE_SERVER_URL || 'https://localhost:65530'
export const USESSL = processEnv.USESSL || false
export const AGENT_WEBSERVER_PORT_RANGE =
  processEnv.AGENT_WEBSERVER_PORT_RANGE || '8000-9000'
