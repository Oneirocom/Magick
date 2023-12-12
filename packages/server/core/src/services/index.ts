// DOCUMENTED
import { request } from './requests/requests'
import { spell } from './spells/spells'
import { agent } from './agents/agents'
import { event } from './events/events'
import { task } from './tasks/tasks'
import { document } from './documents/documents'
import { projects } from './projects/projects'
import { agentImage } from './agentImage/agentImage'

// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'
import { pluginManager } from 'shared/core'
import { slackApi } from 'plugins/slack/src/lib/api/slackApi'
import { FEATURE_FLAGS } from 'shared/config'
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
  app.configure(event)
  app.configure(task)
  app.configure(document)
  app.configure(projects)
  app.configure(agentImage)
  app.configure(credentials)
  if (FEATURE_FLAGS.V2_PLUGINS.includes('slack')) app.configure(slackApi)

  // Wait for a tick to handle race condition
  // TODO: handle this race condition better
  await new Promise(resolve => setTimeout(resolve, 1))

  // Configure services provided by plugins
  pluginManager.getServices().forEach(service => {
    app.configure(service[1])
  })
}
