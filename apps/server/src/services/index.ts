import { spell } from './spells/spells'
import { agent } from './agents/agents'
import { event } from './events/events'
import { user } from './users/users'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'

export const services = (app: Application) => {
  app.configure(spell)
  app.configure(agent)
  app.configure(event)
  app.configure(user)
  // All services will be registered here
}
