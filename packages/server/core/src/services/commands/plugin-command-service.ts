import { Params, ServiceMethods } from '@feathersjs/feathers'
import type { Application } from '../../declarations'
import { z } from 'zod'
import { AgentCommandData } from '@magickml/agent-commander'

const PluginCommandBody = z.object({
  agentId: z.string(),
  plugin: z.string(),
  command: z.string(),
  payload: z.record(z.unknown()).optional(),
})

type PluginCommandBody = z.infer<typeof PluginCommandBody>

export type PluginCommandServiceMethods = Pick<
  ServiceMethods<PluginCommandBody>,
  'create'
>

class PluginCommandService implements PluginCommandServiceMethods {
  app: Application
  options: any

  constructor(options: any = {}, app: Application) {
    this.app = app
    this.options = options
  }

  async create(
    body: PluginCommandBody,
    params: Params
  ): Promise<PluginCommandBody> {
    console.log('plugin command', body, params.query)
    const { agentId, plugin, command } = PluginCommandBody.parse(body)

    const cmd: AgentCommandData = {
      agentId,
      command: `plugin:${plugin}:${command}`,
      data: body.payload || {},
    }

    await this.app.get('agentCommander').command(cmd)

    return body
  }
}

export const pluginCommand = (app: Application): void => {
  app.use('/command', new PluginCommandService({}, app)),
    {
      methods: ['GET'],
    }
}

declare module '../../declarations' {
  interface ServiceTypes {
    ['/command']: PluginCommandService
  }
}
