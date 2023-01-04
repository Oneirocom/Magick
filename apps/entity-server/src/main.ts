import 'regenerator-runtime/runtime'
import { config } from 'dotenv-flow'
config()

// todo fix this import
import { roomManager } from '@thothai/core'
import { database } from '@thothai/database'
import { World } from './World'

async function init() {
  console.log('Starting agent runner')
  new database()
  await database.instance.connect()
  new World()
  new roomManager()
}

init()
