// For more information about this file see https://dove.feathersjs.com/guides/cli/databases.html
import knex from 'knex'
import type { Knex } from 'knex'
import type { Application } from './declarations'

import os from 'os'
const cpuCore = os.cpus()
const isM1 = cpuCore[0].model.includes("Apple M1") || cpuCore[0].model.includes("Apple M2")
const isWindows = os.platform() === 'win32'

declare module './declarations' {
  interface Configuration {
    dbClient: Knex
  }
}
export enum SupportedDbs {
  pg = 'pg',
  sqlite = 'sqlite',
}

export const dbDialect: SupportedDbs = process.env.DATABASE_TYPE as SupportedDbs

const getDatabaseConfig = () => {
  const dbType = process.env.DATABASE_TYPE || ''
  const dbURL = process.env.DATABASE_URL

  if (!dbURL) throw new Error('Missing DATABASE_URL in your .env file.')

  // postgres config
  if (dbType === 'pg')
    return {
      client: dbType,
      connection: dbURL,
    }
  // sqlite config
  if (dbType === 'sqlite')
    return {
      client: dbType,
      connection: {
        filename: dbURL,
      },
      // sqlite does not support inserting default values
      useNullAsDefault: true,
      pool: {
        afterCreate: function (conn, done) {
          if(isM1) {
            console.warn(
              'Could not load VSS extension, vectors currently not supported on ARM64/M1 (this is fine)'
            )
            return done(null, conn)
          }
          if(isWindows) {
            console.warn(
              'Could not load VSS extension, vectors currently not supported on Win32 (this is fine)'
            )
            return done(null, conn)
          }
          // NOTE: the extension files are relative to the repository root directory
            conn.loadExtension('./lib/vector0', err => {
              if( err ) return
              try {
                conn.loadExtension('./lib/vss0', err => {
                  if( err ) return
                  conn.get('select vss_version();', (err, res) => {
                    if( err ) return
                    // create vss_events virtual table if not already exists.
                    conn.get(
                      'create virtual table if not exists vss_events using vss0(event_embedding(1536));',
                      err => {
                        if (err) console.error(err)
                        else
                          console.log('sqlite extensions loaded successfully')
                      }
                    )
                  })
                  done(null, conn)
                })
              } catch (err) {
                console.warn(
                  'Could not load extensions, vectors currently not supported on Win32 or ARM64/M1 (this is fine)'
                )
              }
              done(null, conn)
            })
        },
      },
    }

  throw new Error('Unsupported database type, use `pg` or `sqlite`')
}

export const dbClient = (app: Application) => {
  const config = getDatabaseConfig()
  const db = knex(config)
  app.set('dbClient', db)
}

const dbSupportJson: Record<SupportedDbs, boolean> = {
  [SupportedDbs.pg]: true,
  [SupportedDbs.sqlite]: false,
}

export const doesDbSupportJson = (): boolean => dbSupportJson[dbDialect]
