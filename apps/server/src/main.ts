import 'regenerator-runtime/runtime'
import { config } from 'dotenv-flow'
config({
  path: '../../../',
})

import { worldManager } from '@magickml/engine'
import { World } from './World'

async function init() {  new World()
  new worldManager()
}

init()
