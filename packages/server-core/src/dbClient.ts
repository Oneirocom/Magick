// For more information about this file see https://dove.feathersjs.com/guides/cli/databases.html
import knex from 'knex'
import type { Knex } from 'knex'
import type { Application } from './declarations'
import { SKIP_DB_EXTENSIONS } from "@magickml/engine"

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


//Post gres function for getting the most similar documents after applying prefilter.
let pf_function = `
CREATE OR REPLACE FUNCTION match_events(
  query_embedding vector(1536), 
  match_count int DEFAULT 10, 
  content_to_match text DEFAULT NULL, 
  event_type text DEFAULT NULL, 
  event_sender text DEFAULT NULL, 
  event_client text DEFAULT NULL,
  event_projectId text DEFAULT NULL
)
RETURNS TABLE (
  id text, 
  content text, 
  matched_values json, 
  similarity numeric
)
AS $$
DECLARE
  query_vector float8[];
BEGIN
  -- Find the most similar events to the query vector
  RETURN QUERY
      SELECT 
          e.id::text, 
          e.content, 
          json_build_object(
              'projectId', e."projectId",
              'type', e.type, 
              'sender', e.sender, 
              'client', e.client
          ) AS matched_values, 
          (1 - (e.embedding <=> query_embedding))::numeric as similarity
      FROM 
          public.events e
      WHERE 
          e.embedding IS NOT NULL
          AND (event_projectId IS NULL OR e."projectId" = event_projectId)
          AND (event_type IS NULL OR e.type = event_type)
          AND (event_sender IS NULL OR e.sender = event_sender)
          AND (event_client IS NULL OR e.client = event_client)
          AND (content_to_match IS NULL OR to_tsvector('english', e.content) @@ plainto_tsquery('english', content_to_match))
      ORDER BY 
          e.embedding <=> query_embedding
      LIMIT 
          match_count;
END;
$$ LANGUAGE plpgsql;


`
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
      /* 
      pool: {
        afterCreate: function (conn, done) {
          if(SKIP_DB_EXTENSIONS) {
            console.warn(
              'Skipping loading of sqlite extensions as SKIP_DB_EXTENSIONS is set to true'
            )
            return done(null, conn)
          }
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
          try {
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
                        if (err) return console.error(err)
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
          } catch (err) {
            console.warn(
              'Could not load extensions, vectors currently not supported on Win32 or ARM64/M1 (this is fine)'
            )
          }
        },
      },*/
    }

  throw new Error('Unsupported database type, use `pg` or `sqlite`')
}

export const dbClient = (app: Application) => {
  const config = getDatabaseConfig()
  const db = knex(config)
  app.set('dbClient', db)
  if(process.env.DATABASE_TYPE == "pg"){
    db.raw(pf_function).then(() => {
      console.log("Postgres function created")
    })
  }
}

const dbSupportJson: Record<SupportedDbs, boolean> = {
  [SupportedDbs.pg]: true,
  [SupportedDbs.sqlite]: false,
}

export const doesDbSupportJson = (): boolean => dbSupportJson[dbDialect]
