import { DATABASE_URL } from '@magickml/config'

const config = {
  client: 'pg',
  connection: DATABASE_URL
}

module.exports = config
