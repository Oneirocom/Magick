import { EventPayload, WebhookPayload } from 'server/plugin'
import { corePluginName } from './constants'

type ValidPayload = {
  content: string
  callback?: string
}
export type CoreWebhookPayload = WebhookPayload<ValidPayload>['payload']

export const validateCoreWebhookPayload = (
  payload: unknown
): payload is ValidPayload => {
  return true
}

export type CoreWebhookEventPayload = EventPayload<
  ValidPayload,
  Record<string, unknown>
>

export const formatCoreWebhookPayload = (
  payload: ValidPayload,
  agentId: string
) => {
  const formatted: CoreWebhookEventPayload = {
    connector: corePluginName,
    eventName: 'webhookReceived',
    status: 'success',
    content: payload.content,
    sender: 'assistant', // TODO
    observer: 'assistant',
    client: 'cloud.magickml.com',
    channel: payload.callback || 'none',
    plugin: corePluginName,
    agentId,
    channelType: payload.callback ? 'callback' : 'none',
    rawData: JSON.stringify(payload),
    timestamp: new Date().toISOString(),
    data: payload,
    metadata: {},
  }

  return formatted
}