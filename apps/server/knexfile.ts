const dbURL = process.env.DATABASE_URL

module.exports = {
  client: 'pg',
  connection: dbURL
}