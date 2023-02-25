import { request } from './request/request'
import { spell } from './spells/spells'
import { agent } from './agents/agents'
import { event } from './events/events'
import { spellRunner } from './spell-runner/spell-runner'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'
import { pluginManager } from '@magickml/engine'
export const services = async (app: Application) => {
  app.configure(request)
  console.log(pluginManager)
  const service_list = pluginManager.getServices()
  app.configure(spell)
  app.configure(agent)
  app.configure(event)
  app.configure(spellRunner)
  service_list.forEach((service) => {
    app.use(service[0], new service[1]())
  })
}
