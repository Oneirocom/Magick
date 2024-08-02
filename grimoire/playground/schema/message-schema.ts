import { z } from 'zod'

export default z.object({
  name: z.string(),
  message: z.string(),
})
