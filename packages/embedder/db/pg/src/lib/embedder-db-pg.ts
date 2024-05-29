import { drizzle } from 'drizzle-orm/node-postgres'
import pkg from 'pg'
export const { Client } = pkg
import * as schema from './drizzle/schema'
export * from './drizzle/schema'

export const client = new Client({
  connectionString: process.env['EMBEDDER_DB_URL']!,
})

client.connect()

// { schema } is used for relational queries
export const embedderDb = drizzle(client, { schema, logger: false })
