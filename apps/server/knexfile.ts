import * as dotenv from 'dotenv-flow'
dotenv.config({
  path: '../'
})

console.log('MIGRATING USING DATABASE URL', process.env.DATABASE_URL)

const dbURL = process.env.DATABASE_URL
module.exports = {
  client: 'pg',
  connection: dbURL
}
