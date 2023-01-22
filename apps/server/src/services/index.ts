import { spell } from './spells/spells'
import { agent } from './agents/agents'
import { user } from './users/users'
import { spellRunner } from './spell-runner/spell-runner'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'

export const services = (app: Application) => {
  app.configure(spell)
  app.configure(agent)
  app.configure(user)
  app.configure(spellRunner)
  // All services will be registered here
}
