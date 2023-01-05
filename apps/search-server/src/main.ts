import { config } from 'dotenv-flow'
config({
  path: '../../../',
})
import { initSearchCorpus } from '@magickml/systems'

initSearchCorpus(false)
