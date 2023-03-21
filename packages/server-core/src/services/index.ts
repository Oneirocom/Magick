import { request } from './request/request'
import { spell } from './spells/spells'
import { agent } from './agents/agents'
import { event } from './events/events'
import { spellRunner } from './spell-runner/spell-runner'
import { datasets } from './datasets/datasets'
import { UploadService } from './Upload.class'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'
import { pluginManager } from '@magickml/engine'
export const services = async (app: Application) => {
  app.configure(request)
  app.configure(spell)
  app.configure(agent)
  app.configure(event)
  app.configure(spellRunner)
  app.configure(datasets)
  app.use('upload' as any, new UploadService())
  // TODO: handle this stupid race condition
  await new Promise(resolve => setTimeout(resolve, 1))
  pluginManager.getServices().forEach(service => {
    app.configure(service[1])
  })
}
