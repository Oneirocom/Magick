import { Params, ServiceMethods } from '@feathersjs/feathers'
import type { Application } from '../../declarations'
import { AgentCommandData } from 'server/agents'

type BasePayload = Record<string, any>

export type WebhookServiceMethods = Pick<ServiceMethods<BasePayload>, 'create'>

class WebhookService implements WebhookServiceMethods {
  app: Application
  options: any

  constructor(options: any = {}, app: Application) {
    this.app = app
    this.options = options
  }

  async create(data: BasePayload, params?: Params): Promise<BasePayload> {
    const agentId = params?.route?.agentid as string
    const pluginName = params?.route?.plugin as string

    // TODO: validate that the plugin name exists
    // TODO: if its Core, validate the users wh-key against the header
    const command: AgentCommandData = {
      agentId,
      command: `plugin:${pluginName}:webhook`,
      data,
    }

    await this.app.get('agentCommander').command(command)

    return data
  }
}

export const webhook = (app: Application): void => {
  app.use('/webhook/:agentid/:plugin', new WebhookService({}, app)),
    {
      methods: ['create'],
    }
}

declare module '../../declarations' {
  interface ServiceTypes {
    ['/webhook/:agentid/:plugin']: WebhookService
  }
}