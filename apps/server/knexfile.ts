import { DATABASE_TYPE, DATABASE_URL } from '@magickml/core'

const dbType = DATABASE_TYPE
const dbURL = DATABASE_URL
const configs = {
  pg: {
    client: dbType,
    connection: dbURL
  },
  sqlite: {
    client: dbType, 
    connection: {
      // handling both absolute and relative paths, 
      // for relative path resolve back to the main directory,
      // where .env file exists
      filename: dbURL.startsWith('/') ? dbURL : `../../${dbURL}`
    },
    useNullAsDefault: true
  }
}

module.exports = configs[dbType]