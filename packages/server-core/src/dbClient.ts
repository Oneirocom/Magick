// For more information about this file see https://dove.feathersjs.com/guides/cli/databases.html
import knex from 'knex'
import type { Knex } from 'knex'
import type { Application } from './declarations'

declare module './declarations' {
  interface Configuration {
    dbClient: Knex
  }


}
export enum SupportedDbs {
    pg = 'pg',
    sqlite3 = 'sqlite3'
}

export const dbDialect: SupportedDbs = process.env.DATABASE_TYPE as SupportedDbs

const getDatabaseConfig = () => {
  const dbType = process.env.DATABASE_TYPE || ''
  const dbURL = process.env.DATABASE_URL

  if(!dbURL) throw new Error("Missing DATABASE_URL in your .env file.")

  // postgres config 
  if (dbType === 'pg') 
    return {
      client: dbType,
      connection: dbURL
    }
  // sqlite config 
  if (dbType === 'sqlite3')
    return {
      client: dbType, 
      connection: {
        filename:  dbURL
      },
      // sqlite does not support inserting default values
      useNullAsDefault: true,
      pool: {
        afterCreate: function (conn, done) {
          console.log('loading sqlite extensions')
          // NOTE: the extension files are relative to the repository root directory
          conn.loadExtension('./lib/vector0', err => {
            if (err) console.error(err)
            conn.loadExtension('./lib/vss0', err => {
              if (err) console.error(err)
              conn.get("select vss_version();", (err, res) => {
                if (err) console.error(err)
                console.log('sqlite extensions loaded successfully')
                console.log(res) // should yield `{ 'vss_version()': 'v0.0.1' }`
                // create vss_events virtual table if not already exists.
                conn.get('create virtual table if not exists vss_events using vss0(event_embedding(1536));', err => {
                  if (err) console.error(err)
                })
              })
              done(null, conn)
            })
            done(null, conn)
          })
        }
      }
    }

  throw new Error("Unsupported database type, use `pg` or `sqlite3`")
}

export const dbClient = (app: Application) => {
  const config = getDatabaseConfig()
  const db = knex(config)
  app.set('dbClient', db)
}

const dbSupportJson: Record<SupportedDbs, boolean> = {
  [SupportedDbs.pg]: true,
  [SupportedDbs.sqlite3]: false
}

export const doesDbSupportJson = () :boolean => dbSupportJson[dbDialect]