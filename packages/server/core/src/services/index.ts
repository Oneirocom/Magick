// DOCUMENTED
import { request } from './requests/requests'
import { spell } from './spells/spells'
import { agent } from './agents/agents'
import { knowledge } from './knowledge/knowledge'
import { projects } from './projects/projects'
import { agentImage } from './agentImage/agentImage'
import { spellReleases } from './spellReleases/spellReleases'
import { chatMessages } from './messages/messages'
import { graphEvents } from './graphEvents/graphEvents'
import { users } from './users/users'

// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'
import { credentials } from './credentials/credentials'

/**
 * Configures and registers services for the application.
 *
 * @param app - The FeathersJS application instance.
 * @returns A promise that resolves when all services are configured and registered.
 */
export const services = async (app: Application): Promise<void> => {
  // Configure standard services
  app.configure(request)
  app.configure(spell)
  app.configure(agent)
  app.configure(projects)
  app.configure(agentImage)
  app.configure(chatMessages)
  app.configure(spellReleases)
  app.configure(graphEvents)
  app.configure(credentials)
  app.configure(users)
  app.configure(knowledge)

  // Wait for a tick to handle race condition
  // TODO: handle this race condition better
  await new Promise(resolve => setTimeout(resolve, 1))
}
