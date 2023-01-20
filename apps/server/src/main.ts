import 'regenerator-runtime/runtime'
import { config } from 'dotenv-flow'
config({
  path: '../../../',
})

import { worldManager } from '@magickml/core'
import { database } from '@magickml/database'
import { World } from './World'

async function init() {
  console.log('Starting agent runner')
  new database()
  new World()
  new worldManager()
}

init()
