// GENERATED 
// For more information about this file see https://dove.feathersjs.com/guides/cli/databases.html
import type { Knex } from 'knex';
import knex from 'knex';
import type { Application } from './declarations';

// Extend Configuration interface to include dbClient
declare module './declarations' {
  interface Configuration {
    dbClient: Knex;
  }
}

// Supported database types
export enum SupportedDbs {
  pg = 'pg',
  sqlite = 'sqlite',
}

// Get database type from environment variable
export const dbDialect: SupportedDbs = process.env.DATABASE_TYPE as SupportedDbs;

/**
 * Get database configuration based on environment variables
 *
 * @returns {object} Database configuration settings
 */
const getDatabaseConfig = () => {
  const dbType = process.env.DATABASE_TYPE || '';
  const dbURL = process.env.DATABASE_URL;

  if (!dbURL) throw new Error('Missing DATABASE_URL in your .env file.');

  // PostgreSQL configuration
  if (dbType === SupportedDbs.pg) {
    return {
      client: dbType,
      connection: dbURL,
    };
  }

  // SQLite configuration
  if (dbType === SupportedDbs.sqlite) {
    return {
      client: dbType,
      connection: {
        filename: dbURL,
      },
      useNullAsDefault: true, // SQLite does not support inserting default values
    };
  }

  throw new Error('Unsupported database type, use `pg` or `sqlite`');
};

/**
 * Set up database client
 *
 * @param {Application} app - The application instance
 */
export const dbClient = (app: Application) => {
  const config = getDatabaseConfig();
  const db = knex(config);
  app.set('dbClient', db);
};

// Map of supported databases to their JSON support status
const dbSupportJson: Record<SupportedDbs, boolean> = {
  [SupportedDbs.pg]: true,
  [SupportedDbs.sqlite]: false,
};

/**
 * Check if the current database supports JSON data type
 *
 * @returns {boolean} True if the database supports JSON, false otherwise
 */
export const doesDbSupportJson = (): boolean => dbSupportJson[dbDialect];