import { config } from 'dotenv-flow'
config({
  path: '../../../.env.*',
})

export const API_URL = process.env.API_URL || 'http://localhost:8001'
export const SERVER_PORT = process.env.PORT || 8001
export const GOOGLE_APPLICATION_CREDENTIALS =
  process.env.GOOGLE_APPLICATION_CREDENTIALS || ''
export const SPEECH_SERVER_PORT = process.env.SPEECH_SERVER_PORT || 65532
export const ENABLE_SPEECH_SERVER = process.env.ENABLE_SPEECH_SERVER || true
export const SEARCH_CORPUS_PORT = process.env.SEARCH_CORPUS_PORT || 65531
export const ENABLE_SEARCH_CORPUS = process.env.ENABLE_SEARCH_CORPUS || true
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ''
export const HF_API_KEY = process.env.HF_API_KEY || ''
export const USSSL_SPEECH = process.env.USSSL_SPEECH || true
export const FILE_SERVER_PORT = process.env.FILE_SERVER_PORT || 65530
export const FILE_SERVER_URL =
  process.env.FILE_SERVER_URL || 'https://localhost:65530'
export const USESSL = process.env.USESSL || false
export const WEAVIATE_CLIENT_SCHEME =
  process.env.WEAVIATE_CLIENT_SCHEME || 'http'
export const WEAVIATE_CLIENT_HOST =
  process.env.WEAVIATE_CLIENT_HOST || 'localhost:8080'
export const WEAVIATE_IMPORT_DATA = process.env.WEAVIATE_IMPORT_DATA || false
export const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'
export const ENTITY_WEBSERVER_PORT_RANGE =
  process.env.ENTITY_WEBSERVER_PORT_RANGE || '8000-9000'
export const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://postgres:ZTE*meq1mzh3abn!cmk@db.xpilpcjsizemuijsiask.supabase.co:5432/postgres'
