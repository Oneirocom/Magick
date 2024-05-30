import { Params, ServiceMethods, type Id } from '@feathersjs/feathers'
import type { Application } from '../../declarations'
import { prismaCore, type Prisma } from '@magickml/server-db'

type PluginStateBody = Record<string, any>
type PluginStateParams = {
  agentId: Id
  plugin: string | undefined
}

export type PluginStateServiceMethods = Pick<
  ServiceMethods<PluginStateBody>,
  'find'
>

class PluginStateService implements PluginStateServiceMethods {
  app: Application
  options: any

  constructor(options: any = {}, app: Application) {
    this.app = app
    this.options = options
  }

  async find(params: Params<PluginStateParams>): Promise<PluginStateBody> {
    const agentId = params?.query?.agentId
    const plugin = params?.query?.plugin
    if (typeof agentId !== 'string') {
      throw new Error('No agentId provided')
    }

    const where: Prisma.pluginStateWhereInput = {
      agentId,
    }

    if (plugin) {
      where.plugin = plugin
    }

    return await prismaCore.pluginState.findMany({
      where,
      select: {
        id: true,
        plugin: true,
        state: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }
}

export const pluginState = (app: Application): void => {
  app.use('/state', new PluginStateService({}, app)),
    {
      methods: ['GET'],
    }
}

declare module '../../declarations' {
  interface ServiceTypes {
    ['/state']: PluginStateService
  }
}
