import { ServiceMethods } from '@feathersjs/feathers'
import { Application } from '../../declarations'

export type HealthzServiceMethods = Pick<ServiceMethods<any>, 'get'>

class HealthzService implements HealthzServiceMethods {
  app: Application

  constructor(app: Application) {
    this.app = app
  }

  async get(): Promise<{ status: string; timestamp: string }> {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
    }
  }
}

export const healthz = (app: Application): void => {
  app.use('/healthz', new HealthzService(app))
}

declare module '../../declarations' {
  interface ServiceTypes {
    '/healthz': HealthzService
  }
}
