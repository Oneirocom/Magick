import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const recordTableSchema = z.object({
  id: z.string(),
  key: z.string(),
  data: z.any(),
  createdAt: z.string(),
})

export type RecordTableSchema = z.infer<typeof recordTableSchema>
