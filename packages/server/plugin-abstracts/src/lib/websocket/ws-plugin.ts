import { PluginStateType } from 'plugin-state'
import { PluginCredentialsType } from 'server/credentials'
import { CoreEventsPlugin, EventPayload } from 'server/plugin'

export abstract class AbstractWebsocketPlugin<
  CoreEvents extends Record<string, (...args: any[]) => void> = Record<
    string,
    (...args: any[]) => void
  >,
  Payload extends Partial<EventPayload> = Partial<EventPayload>,
  Data = Record<string, unknown>,
  Metadata = Record<string, unknown>,
  State extends PluginStateType = PluginStateType,
  Credentials extends PluginCredentialsType = PluginCredentialsType
> extends CoreEventsPlugin<
  CoreEvents,
  Payload,
  Data,
  Metadata,
  State,
  Credentials
> {
  abstract login(credentials: Credentials): Promise<void>

  abstract logout(): Promise<void>
  
  abstract handleEnable(): Promise<void>

  abstract handleDisable(): Promise<void>

  abstract refreshContext(): Promise<void>

  // abstract parseCredentials(credentials: Credentials): Promise<Credentials>

  // abstract validateCredentials(credentials: Credentials): void

  abstract setupEventListener(eventName: string): void | Promise<void>

  abstract setupAllEventListeners(): void | Promise<void>
}
