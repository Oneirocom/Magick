import { SlackEvent as BoltEvents } from '@slack/bolt'
import { EventPayload } from 'server/plugin'
import type { App, EventFromType } from '@slack/bolt'
import { PLUGIN_SETTINGS } from 'shared/config'
import type { CreateCredentialsRecord, PluginStateType } from 'server/plugin'
import { PluginCredential } from 'server/credentials'
import { createEventsEnum } from 'plugins/shared'

// BASE
export const slackPluginName = 'slack' as const
export const SLACK_DEVELOPER_MODE = PLUGIN_SETTINGS.SLACK_DEVELOPER_MODE

// STATE
type SlackAuthTest = Awaited<ReturnType<App['client']['auth']['test']>>

export type SlackAgentContext = {
  id: string | undefined
  username: string | undefined
  authTest: SlackAuthTest | undefined
  platform: 'slack'
}

export interface SlackPluginState extends PluginStateType {
  enabled: boolean
  context: SlackAgentContext
}

export const slackDefaultState: SlackPluginState = {
  enabled: false,
  context: {
    id: '',
    username: '',
    authTest: undefined,
    platform: slackPluginName,
  },
}

// CREDENTIALS
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
] as const satisfies ReadonlyArray<PluginCredential>

export type SlackCredentials = CreateCredentialsRecord<
  typeof slackPluginCredentials
>

// EVENTS
export type SlackEvents = BoltEvents['type']
export const slackEventNames: SlackEvents[] = ['message']
export const SLACK_EVENTS = createEventsEnum(slackEventNames)

// slack 'message' event has subtypes that are there own kind of thing to parse
// we omit undefined here, but subtype was then the message is a base message event
export type SlackMessageSubtypes = Exclude<
  EventFromType<'message'>['subtype'],
  undefined
>

// this is the event when the subtype is undefined
export type SlackBaseMessageEvent = EventFromType<'message'> & {
  subtype: undefined
}

// this is all message with a subtype
export type SlackMessageEvents = {
  [key in SlackMessageSubtypes]: EventFromType<'message'>
}

export type BaseSlackEventPayload = {
  SlackEvents: EventFromType<SlackEvents>
}

export type SlackEventMetadata = Record<string, unknown> & {
  context: SlackAgentContext | null | undefined
}

export type SlackEventPayload = EventPayload<
  BaseSlackEventPayload[keyof BaseSlackEventPayload],
  SlackEventMetadata
>

export type SlackEvent = EventPayload<
  SlackEventPayload[keyof SlackEventPayload],
  SlackEventMetadata
>

// ACTIONS
export const SLACK_ACTIONS = createEventsEnum(['sendMessage'])

//// DEPENDENCIES
export enum SLACK_DEPENDENCIES {
  SLACK_CLIENT = 'slackClient',
  SLACK_SEND_MESSAGE = 'sendSlackMessage',
}

// COMMANDS
export enum SLACK_COMMANDS {}

// METHODS
export type SendSlackMessage = (
  content: string,
  channel: string
) => Promise<void>
