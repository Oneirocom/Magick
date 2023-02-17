import { config } from 'dotenv-flow'
config({
  path: '../../../.env.*',
})

const importMetaEnv = typeof import.meta !== 'undefined' && typeof import.meta.env !== 'undefined' ? import.meta.env : {} as any

// process is not defined on client
const processEnv = typeof process === 'undefined' ? importMetaEnv : process.env

export const SERVER_PORT = processEnv.PORT || 3031
export const VITE_APP_API_URL = processEnv.VITE_APP_API_URL
export const API_ROOT_URL = VITE_APP_API_URL || processEnv.API_ROOT_URL || `http://localhost:${SERVER_PORT}`
export const GOOGLE_APPLICATION_CREDENTIALS =
  processEnv.GOOGLE_APPLICATION_CREDENTIALS || ''
export const SPEECH_SERVER_PORT = processEnv.SPEECH_SERVER_PORT || 65532
export const ENABLE_SPEECH_SERVER = processEnv.ENABLE_SPEECH_SERVER || true
export const SEARCH_CORPUS_PORT = processEnv.SEARCH_CORPUS_PORT || 65531
export const ENABLE_SEARCH_CORPUS = processEnv.ENABLE_SEARCH_CORPUS || true
export const OPENAI_API_KEY = processEnv.OPENAI_API_KEY || ''
export const OPENAI_ENDPOINT_OVERRIDE = processEnv.OPENAI_ENDPOINT_OVERRIDE || null
export const HF_API_KEY = processEnv.HF_API_KEY || ''
export const USSSL_SPEECH = processEnv.USSSL_SPEECH || true
export const FILE_SERVER_PORT = processEnv.FILE_SERVER_PORT || 65530
export const FILE_SERVER_URL =
  processEnv.FILE_SERVER_URL || 'https://localhost:65530'
export const USESSL = processEnv.USESSL || false
export const ENTITY_WEBSERVER_PORT_RANGE =
  processEnv.ENTITY_WEBSERVER_PORT_RANGE || '8000-9000'
export const DATABASE_URL =
  processEnv.DATABASE_URL ||
  'postgresql://postgres:ZTE*meq1mzh3abn!cmk@db.xpilpcjsizemuijsiask.supabase.co:5432/postgres'
export const APP_SEARCH_SERVER_URL =
  processEnv.APP_SEARCH_SERVER_URL || `http://localhost:${SEARCH_CORPUS_PORT}`
export const CASTER_PORT = processEnv.CASTER_PORT || 8002
