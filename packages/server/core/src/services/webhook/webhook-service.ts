import { Params, ServiceMethods, HookContext } from '@feathersjs/feathers'
import type { Application } from '../../declarations'
import { getUniquePluginNames } from 'shared/nodeSpec'
import { AgentCommandData } from '@magickml/agent-commander'

type WebhookBody = Record<string, any>
type WebhookHeaders = Record<string, any>
type BasePayload = {
  body: WebhookBody
  headers: WebhookHeaders
}

export type WebhookServiceMethods = Pick<ServiceMethods<BasePayload>, 'create'>

const webhookMiddleware = async (context: HookContext) => {
  const headers = context.arguments[1]?.headers || {}
  const d = {
    body: context.data,
    headers: headers,
  }

  context.data = d
  return context
}

class WebhookService implements WebhookServiceMethods {
  app: Application
  options: any

  constructor(options: any = {}, app: Application) {
    this.app = app
    this.options = options
  }

  private publicNames = getUniquePluginNames()

  async create(data: BasePayload, params?: Params): Promise<BasePayload> {
    console.log('WEBHOOK DATA', data)
    const agentId = params?.route?.agentid as string
    const pluginName = params?.route?.plugin as string

    // validate that the plugin name exists
    if (!this.publicNames.includes(pluginName)) {
      throw new Error(`Plugin ${pluginName} does not exist`)
    }

    // TODO: if its Core, validate the users wh-key against the header
    const command: AgentCommandData = {
      agentId,
      command: `plugin:${pluginName}:webhook`,
      data,
    }

    await this.app.get('agentCommander').command(command)

    return { body: {}, headers: {} }
  }
}

export const webhook = (app: Application): void => {
  app.use('/webhook/:agentid/:plugin', new WebhookService({}, app)),
    {
      methods: ['create'],
    }

  app.service('/webhook/:agentid/:plugin').hooks({
    before: {
      all: [webhookMiddleware],
    },
  })
}

declare module '../../declarations' {
  interface ServiceTypes {
    ['/webhook/:agentid/:plugin']: WebhookService
  }
}
