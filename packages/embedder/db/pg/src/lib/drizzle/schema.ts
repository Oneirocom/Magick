import { pgSchema, timestamp, text, boolean, jsonb } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm/relations'
import { z } from 'zod'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const rag = pgSchema('rag')

export const LoaderType = rag.enum('LoaderType', [
  'text',
  'youtube',
  'youtube_channel',
  'youtube_search',
  'web',
  'sitemap',
  'pdf',
  'docx',
  'excel',
  'ppt',
  'confluence',
  'json',
])

export const PackStatus = rag.enum('PackStatus', [
  'pending',
  'processing',
  'completed',
  'failed',
])

export const Pack = rag.table('Pack', {
  id: text('id').primaryKey().notNull(),
  name: text('name'),
  description: text('description'),
  owner: text('owner').notNull(),
  entity: text('entity').notNull(),
  shared: boolean('shared').default(false).notNull(),
  createdAt: timestamp('createdAt', { precision: 3, mode: 'string' })
    .defaultNow()
    .notNull(),
})

export const Loader = rag.table('Loader', {
  id: text('id').primaryKey().notNull(),
  name: text('name'),
  description: text('description'),
  packId: text('packId')
    .notNull()
    .references(() => Pack.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  type: LoaderType('type').notNull(),
  config: jsonb('config').notNull(),
  status: PackStatus('status').notNull().default('pending'),
  raw: jsonb('raw').default({}),
  meta: jsonb('meta').default({}),
})

export const Job = rag.table('Job', {
  id: text('id').primaryKey().notNull(),
  entity: text('entity').notNull(),
  packId: text('packId')
    .notNull()
    .references(() => Pack.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  loaders: jsonb('loaders').array(),
  createdAt: timestamp('createdAt', { precision: 3, mode: 'string' })
    .defaultNow()
    .notNull(),
  finishedAt: timestamp('finishedAt', { precision: 3, mode: 'string' }),
  status: PackStatus('status').notNull().default('pending'),
})

export const ApiKey = rag.table('ApiKey', {
  id: text('id').primaryKey().notNull(),
  key: text('key').notNull(),
  createdAt: timestamp('createdAt', { precision: 3, mode: 'string' })
    .defaultNow()
    .notNull(),
  agentId: text('agentId').notNull(),
})

export const PackRelations = relations(Pack, ({ many }) => ({
  loaders: many(Loader),
  jobs: many(Job),
}))

export const LoaderRelations = relations(Loader, ({ one }) => ({
  pack: one(Pack, {
    fields: [Loader.packId],
    references: [Pack.id],
  }),
}))

export const JobRelations = relations(Job, ({ one }) => ({
  pack: one(Pack, {
    fields: [Job.packId],
    references: [Pack.id],
  }),
}))

// Create Zod schemas from Drizzle schemas
export const PackInsertSchema = createInsertSchema(Pack, {
  id: z.string().uuid(),
  name: z.string().optional(),
  description: z.string().optional(),
  owner: z.string().optional(),
  entity: z.string(),
  shared: z.boolean(),
  createdAt: z.string().or(z.date()),
})
export const PackSelectSchema = createSelectSchema(Pack, {
  id: z.string().uuid(),
  name: z.string().optional(),
  description: z.string().optional(),
  owner: z.string().optional(),
  entity: z.string(),
  shared: z.boolean(),
  createdAt: z.string().or(z.date()),
})

export const LoaderInsertSchema = createInsertSchema(Loader, {
  id: z.string().uuid(),
  name: z.string().optional(),
  description: z.string().optional(),
  packId: z.string().uuid(),
  type: z.enum([
    'text',
    'youtube',
    'youtube_channel',
    'youtube_search',
    'web',
    'sitemap',
    'pdf',
    'docx',
    'excel',
    'ppt',
    'confluence',
    'json',
  ]),
  config: z.any(),
})
export const LoaderSelectSchema = createSelectSchema(Loader, {
  id: z.string().uuid(),
  name: z.string().optional(),
  description: z.string().optional(),
  packId: z.string().uuid(),
  type: z.enum([
    'text',
    'youtube',
    'youtube_channel',
    'youtube_search',
    'web',
    'sitemap',
    'pdf',
    'docx',
    'excel',
    'ppt',
    'confluence',
    'json',
  ]),
  config: z.any(),
})

export const JobInsertSchema = createInsertSchema(Job, {
  id: z.string().uuid(),
  entity: z.string(),
  packId: z.string().uuid(),
  loaders: z.array(z.any()),
  createdAt: z.date(),
  finishedAt: z.date().optional(),
  status: z.enum(['pending', 'processing', 'completed', 'failed']),
})
export const JobSelectSchema = createSelectSchema(Job, {
  id: z.string().uuid(),
  entity: z.string(),
  packId: z.string().uuid(),
  loaders: z.array(z.any()),
  createdAt: z.date(),
  finishedAt: z.date().optional(),
  status: z.enum(['pending', 'processing', 'completed', 'failed']),
})
