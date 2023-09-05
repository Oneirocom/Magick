import { resolve } from '@feathersjs/schema'
import { Type, getValidator } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '@magickml/server-core'
import { dataValidator } from '@magickml/server-core'

export type SlackEvent = {
  token: string
  team_id: string
  api_app_id: string
  event: {
    client_msg_id: string
    type: string
    text: string
    user: string
    ts: string
    blocks: {
      type: string
      block_id: string
      elements: any[]
    }[]
    team: string
    channel: string
    event_ts: string
  }
  type: string
  event_id: string
  event_time: number
  authorizations: {
    enterprise_id: null | string
    team_id: string
    user_id: string
    is_bot: boolean
    is_enterprise_install: boolean
  }[]
  is_ext_shared_channel: boolean
  event_context: string
}

/**
 * Main data model schema for Slack POST request
 */
export const slackSchema = Type.Object(
  {
    token: Type.String(),
    team_id: Type.String(),
    api_app_id: Type.String(),
    event: Type.Object({
      client_msg_id: Type.String(),
      type: Type.String(),
      text: Type.String(),
      user: Type.String(),
      ts: Type.String(),
      blocks: Type.Array(
        Type.Object({
          type: Type.String(),
          block_id: Type.String(),
          elements: Type.Array(Type.Any()),
        })
      ),
      team: Type.String(),
      channel: Type.String(),
      event_ts: Type.String(),
    }),
    type: Type.String(),
    event_id: Type.String(),
    event_time: Type.Number(),
    authorizations: Type.Array(
      Type.Object({
        enterprise_id: Type.Union([Type.Null(), Type.String()]),
        team_id: Type.String(),
        user_id: Type.String(),
        is_bot: Type.Boolean(),
        is_enterprise_install: Type.Boolean(),
      })
    ),
    is_ext_shared_channel: Type.Boolean(),
    event_context: Type.String(),
  },
  { $id: 'Slack', additionalProperties: true }
)

export type Slack = Static<typeof slackSchema>
export const slackValidator = getValidator(slackSchema, dataValidator)
export const slackResolver = resolve<Slack, HookContext>({})

export const slackExternalResolver = resolve<Slack, HookContext>({})
