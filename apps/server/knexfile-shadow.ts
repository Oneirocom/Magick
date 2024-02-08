import * as dotenv from 'dotenv-flow'
dotenv.config({
  path: '../'
})

console.log('MIGRATING USING SHADOW DATABASE URL', process.env.SHADOW_DATABASE_URL)

const dbURL = process.env.SHADOW_DATABASE_URL
module.exports = {
  client: 'pg',
  connection: dbURL
}
