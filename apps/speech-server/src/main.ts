import { config } from 'dotenv-flow'
config()
import { initSpeechServer } from '@thothai/systems'

// @ts-ignore
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
initSpeechServer(false)
