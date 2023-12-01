// DOCUMENTED
// For more information about this file see https://dove.feathersjs.com/guides/cli/databases.html
import type { Knex } from 'knex'
import knex from 'knex'
import type { Application } from './declarations'
import { DATABASE_URL } from 'shared/config'

// Extend Configuration interface to include dbClient

declare module './declarations' {
  interface Configuration {
    dbClient: Knex
  }
}

//Postgres function for getting the most similar events after applying prefilter.
// const pf_events = `
// CREATE OR REPLACE FUNCTION match_events(
//   query_embedding vector(1536),
//   match_count int DEFAULT 10,
//   content_to_match text DEFAULT NULL,
//   event_type text DEFAULT NULL,
//   event_sender text DEFAULT NULL,
//   event_client text DEFAULT NULL,
//   event_projectId text DEFAULT NULL
// )
// RETURNS TABLE (
//   id text,
//   content text,
//   matched_values json,
//   similarity numeric
// )
// AS $$
// DECLARE
//   query_vector float8[];
// BEGIN
//   -- Find the most similar events to the query vector
//   RETURN QUERY
//       SELECT
//           e.id::text,
//           e.content,
//           json_build_object(
//               'projectId', e."projectId",
//               'type', e.type,
//               'sender', e.sender,
//               'client', e.client
//           ) AS matched_values,
//           (1 - (e.embedding <=> query_embedding))::numeric as similarity
//       FROM
//           public.events e
//       WHERE
//           e.embedding IS NOT NULL
//           AND (event_projectId IS NULL OR e."projectId" = event_projectId)
//           AND (event_type IS NULL OR e.type = event_type)
//           AND (event_sender IS NULL OR e.sender = event_sender)
//           AND (event_client IS NULL OR e.client = event_client)
//           AND (content_to_match IS NULL OR to_tsvector('english', e.content) @@ plainto_tsquery('english', content_to_match))
//       ORDER BY
//           e.embedding <=> query_embedding
//       LIMIT
//           match_count;
// END;
// $$ LANGUAGE plpgsql;
// `
/**
 * Get database configuration based on environment variables
 *
 * @returns {object} Database configuration settings
 */
const getDatabaseConfig = () => {
  const dbURL = DATABASE_URL
  if (!dbURL) throw new Error('Missing DATABASE_URL in your .env file.')
  return {
    client: 'pg',
    connection: dbURL,
  }
}

/**
 * Set up database client
 *
 * @param {Application} app - The application instance
 */
export const dbClient = (app: Application) => {
  const config = getDatabaseConfig()
  const db = knex(config)
  app.set('dbClient', db)
  // db.raw(pf_events).then(() => {
  //   console.log('Postgres function created')
  // })
}
