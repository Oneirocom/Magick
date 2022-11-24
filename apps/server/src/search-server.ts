import { config } from 'dotenv-flow'
config()
import { initSearchCorpus } from './systems/searchCorpus'

initSearchCorpus(false)
