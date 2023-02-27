// For more information about this file see https://dove.feathersjs.com/guides/cli/databases.html
import knex from 'knex'
import type { Knex } from 'knex'
import type { Application, SupportedDbs } from './declarations'

declare module './declarations' {
  interface Configuration {
    dbClient: Knex
  }

  type SupportedDbs = 'pg' | 'sqlite3'
}
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
        // afterCreate: function (conn, done) {
        //   // in this example we use pg driver's connection API
        //   conn.query('SET timezone="UTC";', function (err) {
        //     if (err) {
        //       // first query failed, 
        //       // return error and don't try to make next query
        //       done(err, conn);
        //     } else {
        //       // do the second query...
        //       conn.query(
        //         'SELECT set_limit(0.01);', 
        //         function (err) {
        //           // if err is not falsy, 
        //           //  connection is discarded from pool
        //           // if connection aquire was triggered by a 
        //           // query the error is passed to query promise
        //           done(err, conn);
        //         });
        //     }
        //   });
        // }
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
  'pg': true,
  'sqlite3': false
}

export const doesDbSupportJson = () :boolean => dbSupportJson[process.env.DATABASE_TYPE]