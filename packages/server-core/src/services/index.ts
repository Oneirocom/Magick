import { request } from './request/request'
import { spell } from './spells/spells'
import { agent } from './agents/agents'
import { event } from './events/events'
import { spellRunner } from './spell-runner/spell-runner'
import { UploadService } from './Upload.class'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'
import { pluginManager } from '@magickml/engine'
export const services = async (app: Application) => {
  app.configure(request)
  const service_list = pluginManager.getServices()
  
  app.configure(spell)
  app.configure(agent)
  app.configure(event)
  app.configure(spellRunner)
  app.use('upload' as any, new UploadService())
  service_list.forEach((service) => {
    console.log('service', service)
    app.use(service[0], new service[1]())
  })
}
