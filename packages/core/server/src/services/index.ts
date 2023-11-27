// DOCUMENTED
import { request } from './requests/requests'
import { spell } from './spells/spells'
import { agent } from './agents/agents'
import { event } from './events/events'
import { task } from './tasks/tasks'
import { document } from './documents/documents'
import { projects } from './projects/projects'
import { spellRunner } from './spell-runner/spell-runner'
import { agentImage } from './agentImage/agentImage'
import { collection } from './collections/collections'
import { records } from './records/records'
import { generations } from './generations/generations'

// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'
import { pluginManager } from '@magickml/core'

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
  app.configure(spellRunner)
  app.configure(projects)
  app.configure(agentImage)
  app.configure(collection)
  app.configure(records)
  app.configure(generations)

  // Wait for a tick to handle race condition
  // TODO: handle this race condition better
  await new Promise(resolve => setTimeout(resolve, 1))

  // Configure services provided by plugins
  pluginManager.getServices().forEach(service => {
    app.configure(service[1])
  })
}
