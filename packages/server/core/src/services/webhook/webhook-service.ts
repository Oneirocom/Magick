// webhook.service.ts
import {
  Id,
  NullableId,
  Paginated,
  Params,
  ServiceMethods,
} from '@feathersjs/feathers'
import type { Application } from '../../declarations'
import { prismaCore, type Prisma } from '@magickml/server-db'
import { AgentCommandData } from 'server/agents'
import { KnexAdapterOptions } from '@feathersjs/knex'

export type WebhookServiceMethods = Pick<ServiceMethods<unknown>, 'create'>

class WebhookService implements WebhookServiceMethods {
  app: Application

  constructor(options: any = {}, app: Application) {
    this.app = app
  }

  async setup(app: Application, path: string): Promise<void> {
    this.app = app
  }

  async create(data: unknown, params?: Params): Promise<unknown> {
    const agentId = params?.route?.agentid as string
    const pluginName = params?.route?.plugin as string
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
