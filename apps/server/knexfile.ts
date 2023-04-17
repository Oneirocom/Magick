const dbType = process.env.DATABASE_TYPE
const dbURL = process.env.DATABASE_URL
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