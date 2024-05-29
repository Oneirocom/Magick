import { relations } from 'drizzle-orm/relations'
import { Pack, Loader, Job } from './schema'

export const LoaderRelations = relations(Loader, ({ one }) => ({
  pack: one(Pack, {
    fields: [Loader.packId],
    references: [Pack.id],
  }),
}))

export const PackRelations = relations(Pack, ({ many }) => ({
  loaders: many(Loader, {
    relationName: 'loaders',
  }),
  jobs: many(Job, {
    relationName: 'jobs',
  }),
}))

export const JobRelations = relations(Job, ({ one }) => ({
  Pack: one(Pack, {
    fields: [Job.packId],
    references: [Pack.id],
  }),
}))
