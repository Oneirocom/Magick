import { spell } from './spells/spells'
import { agent } from './agents/agents'
import { user } from './users/users'
import { spellRunner } from './spell-runner/spell-runner'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'
import { pluginManager } from '@magickml/engine'
import DiscordPlugin from '@magickml/plugin-discord'
import WeaviatePlugin from '@magickml/plugin-weaviate'
console.log("Loading Services from:")
console.log(DiscordPlugin.services)
console.log(WeaviatePlugin.services)
export const services = (app: Application) => {
  const service_list = pluginManager.getServices()
  app.configure(spell)
  app.configure(agent)
  app.configure(user)
  app.configure(spellRunner)
  service_list.forEach((service)=>{
    console.log('service', service)
      app.use(service[0], new service[1])
  })
  // All services will be registered here
}
