import {
  defineObjectSchema,
  defineStringSchema,
  defineNumberSchema,
} from '@magickml/schemas/runtime/utils'
import { z } from 'zod'

export defaultConfig defineObjectSchema(
  {
    id: defineStringSchema({ description: "User's unique identifier" }).schema,
    name: defineStringSchema({
      min: 2,
      max: 50,
      description: "User's full name",
    }).schema,
    email: z.string().email(),
    age: defineNumberSchema({
      min: 18,
      max: 120,
      int: true,
      description: "User's age",
    }).schema,
  },
  'User schema'
)
