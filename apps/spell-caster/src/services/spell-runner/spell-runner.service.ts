// Initializes the `spellRunner` service on path `/spell-runner`
import { ServiceAddons } from '@feathersjs/feathers'
import { append } from 'cheerio/lib/api/manipulation'
import { Application } from '../../declarations'
import { SpellRunner } from './spell-runner.class'
import hooks from './spell-runner.hooks'

// // Add this service to the service type index
// declare module '../../declarations' {
//   interface ServiceTypes {
//     'spell-runner': SpellRunner & ServiceAddons<any>
//   }
// }

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate'),
  }

  // Initialize our service with any options it requires
  app.use('spell-runner', new SpellRunner(app))

  // Get our initialized service so that we can register hooks
  const service = app.service('spell-runner')

  service.hooks(hooks)
}
