import { z } from 'zod'
import { H3EventContext } from 'h3'

export const AuthorizedContext = z.object({
  // status: z.literal("authorized"),
  owner: z.string(),
  entity: z.string(),
})

export const UnauthorizedContext = z.object({
  // status: z.literal("unauthorized"),
  owner: z.undefined(),
  entity: z.undefined(),
})

export const AuthContextSchema = z.union([
  AuthorizedContext,
  UnauthorizedContext,
])

export type AuthContext = z.infer<typeof AuthContextSchema>

export const authParse = (context: H3EventContext) =>
  AuthorizedContext.parse(context['auth'])
