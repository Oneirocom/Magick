import { z } from 'zod'

const name = z.string().optional()
const description = z.string().optional()

/* MATCHES PRISMA/PG */
export const PackSchema = z.object({
  id: z.string().uuid(),
  name,
  description,
  owner: z.string().optional(),
  entity: z.string(),
  shared: z.boolean(),
  createdAt: z.string().or(z.date()),
})

/* CREATE */
export const CreatePackRequestSchema = z.object({
  name,
  description,
})

export const CreatePackResponseSchema = PackSchema

/* FIND */
export const FindPackResponseSchema = PackSchema.extend({
  loaders: z.any().optional(),
})

/* LIST */
export const ListPackResponseSchema = z.array(
  PackSchema.extend({
    loaders: z.any().optional(),
  })
)

/* UPDATE */
export const UpdatePackSchema = z.object({
  name,
  description,
})

export const UpdatePackResponseSchema = PackSchema

/* DELETE */
export const DeletePackResponseSchema = z.object({
  id: z.string().uuid(),
})

export const PackQueryRequestSchema = z.object({
  query: z.string(),
  // conversationId: z.string().optional(), //We don't need this
})

export const ExtractChunkDataSchema = z.object({
  score: z.number(),
  pageContent: z.string(),
  metadata: z.record(z.union([z.string(), z.number(), z.boolean()])),
})

export const PackQueryContextSchema = z.array(ExtractChunkDataSchema)
