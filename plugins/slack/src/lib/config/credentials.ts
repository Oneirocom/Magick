import {
  type ExtractPluginCredentialNames,
  type PluginCredential,
} from 'packages/server/credentials/src'
import { slackPluginName } from '.'
import { z } from 'zod'

export const slackPluginCredentials = [
  {
    name: 'slack-token',
    serviceType: 'slack',
    credentialType: 'plugin',
    initials: 'SL',
    clientName: 'Slack Token',
    icon: 'https://a.slack-edge.com/80588/marketing/img/meta/favicon-32.png',
    helpLink: 'https://api.slack.com/apps/',
    description: 'Used to  recieve events from Slack',
    available: true,
    pluginName: slackPluginName,
  },
  {
    name: 'slack-signing-secret',
    serviceType: 'slack',
    credentialType: 'plugin',
    initials: 'SL',
    clientName: 'Slack Signing Secret',
    icon: 'https://a.slack-edge.com/80588/marketing/img/meta/favicon-32.png',
    helpLink: 'https://api.slack.com/apps/',
    description: 'Used to verify requests from Slack',
    available: true,
    pluginName: slackPluginName,
  },
  {
    name: 'slack-app-token',
    serviceType: 'slack',
    credentialType: 'plugin',
    initials: 'SL',
    clientName: 'Slack App Token',
    icon: 'https://a.slack-edge.com/80588/marketing/img/meta/favicon-32.png',
    helpLink: 'https://api.slack.com/apps/',
    description: 'Used to send messages to Slack',
    available: true,
    pluginName: slackPluginName,
  },
] as const satisfies PluginCredential[]

export type SlackCredentialNames = ExtractPluginCredentialNames<
  typeof slackPluginCredentials
>

export type SlackCredentialsKeys = {
  [K in SlackCredentialNames]: string | undefined
}

export type SlackCredentials = Record<SlackCredentialNames, string | undefined>

export const slackPluginCredentialsSchema = z.object({
  'slack-token': z.string(),
})

// parse but don't validate
export const parseSlackPluginCredentials = (state: unknown) => {
  return slackPluginCredentialsSchema.safeParse(state)
}

// validate and parse
export const validateSlackPluginCredentials = (state: unknown) => {
  return slackPluginCredentialsSchema.parse(state)
}
