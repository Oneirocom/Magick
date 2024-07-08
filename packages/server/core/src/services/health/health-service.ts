import { ServiceMethods } from '@feathersjs/feathers'
import type { Application } from '../../declarations'
import { getRawNodeSpec } from '@magickml/node-spec'

export type HealthSeviceMethods = Pick<ServiceMethods<any>, 'find'>

class HealthService implements HealthSeviceMethods {
  app: Application
  options: any

  constructor(options: any = {}, app: Application) {
    this.app = app
    this.options = options
  }

  async find() {
    return { nodeSpec: getRawNodeSpec() }
  }
}

export const health = (app: Application): void => {
  app.use('/health', new HealthService({}, app)),
    {
      methods: ['create'],
    }
}

declare module '../../declarations' {
  interface ServiceTypes {
    ['/health']: HealthService
  }
}
