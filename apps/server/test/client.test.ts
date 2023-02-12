// For more information about this file see https://dove.feathersjs.com/guides/cli/client.test.html
import assert from 'assert'
import axios from 'axios'

import rest from '@feathersjs/rest-client'
import { app } from '../src/app'
import { createClient } from '../src/client'

const port = app.get('port')
const appUrl = `http://${app.get('host')}:${port}`

describe('application client tests', () => {
  const client = createClient(rest(appUrl).axios(axios))

  it('initialized the client', () => {
    assert.ok(client)
  })
})
