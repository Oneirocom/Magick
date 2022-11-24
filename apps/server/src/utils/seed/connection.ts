import { Client } from 'pg'
import { config } from 'dotenv-flow'

config()

let client = new Client({
  user: process.env.PGUSER as any,
  password: process.env.PGPASSWORD as any,
  database: process.env.PGDATABASE as any,
  port: process.env.PGPORT as any,
  host: process.env.PGHOST,
  ssl: false,
})

export const connect = () => client.connect()

export const clients = client
