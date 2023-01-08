import { config } from 'dotenv-flow'
config({
  path: '../../../',
})
import { initSpeechServer } from '@magickml/systems'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
initSpeechServer(false)
