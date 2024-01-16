// TODO: Make this the type returned from isEvent
export type SlackEventPayload = any

export type SlackCredentials = {
  token: string | undefined
  signingSecret: string | undefined
  appToken: string | undefined
}

export interface SlackState extends Record<string, unknown> {
  enabled: boolean
}
