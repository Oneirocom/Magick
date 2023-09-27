import { DATABASE_URL } from 'shared/config'

const config = {
  client: 'pg',
  connection: DATABASE_URL
}

module.exports = config
