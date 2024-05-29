import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  out: './src/lib/drizzle',
  schema: './src/lib/drizzle/schema.ts',
  schemaFilter: 'rag',
  dbCredentials: {
    url: process.env.EMBEDDER_DB_URL!,
  },
  // Print all statements
  verbose: true,
  // Always ask for confirmation
  strict: true,
})
