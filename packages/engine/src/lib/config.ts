import { config } from 'dotenv-flow'
config({
  path: '../../../.env.*',
})

const importMetaEnv =
  typeof import.meta !== 'undefined' && typeof import.meta.env !== 'undefined'
    ? import.meta.env
    : ({} as any)

// process is not defined on client
const processEnv = typeof process === 'undefined' ? importMetaEnv : process.env

function getVarForEnvironment(env){
  return processEnv[env] || processEnv['VITE_' + env] || processEnv['NEXT_' + env] || processEnv['REACT_']
}

export const IGNORE_AUTH = getVarForEnvironment('IGNORE_AUTH') === 'true'
export const DEFAULT_PROJECT_ID = getVarForEnvironment('PROJECT_ID') || 'bb1b3d24-84e0-424e-b4f1-57603f307a89'
export const SERVER_PORT = getVarForEnvironment('PORT') || 3030
export const API_ROOT_URL = getVarForEnvironment('APP_API_URL') || `http://localhost:${SERVER_PORT}`
export const GOOGLE_APPLICATION_CREDENTIALS = processEnv.GOOGLE_APPLICATION_CREDENTIALS || ''
export const SPEECH_SERVER_PORT = getVarForEnvironment('SPEECH_SERVER_PORT') || 65532
export const ENABLE_SPEECH_SERVER = getVarForEnvironment('ENABLE_SPEECH_SERVER') || true
export const OPENAI_ENDPOINT = getVarForEnvironment('OPENAI_ENDPOINT') || 'https://api.openai.com/v1'
export const USSSL_SPEECH = getVarForEnvironment('USSSL_SPEECH') || true
export const FILE_SERVER_PORT = getVarForEnvironment('FILE_SERVER_PORT') || 65530
export const FILE_SERVER_URL = getVarForEnvironment('FILE_SERVER_URL') || 'https://localhost:65530'
export const USESSL = getVarForEnvironment('USESSL') || false
