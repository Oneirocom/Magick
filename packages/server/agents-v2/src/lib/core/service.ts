import { Agent } from '../Agent'
import { ServiceType } from '../interfaces/IDependencies'
import { Constructor } from './DIContainer'

interface Service {
  apply(agent: Agent): void | Promise<void>
}

class ServiceManager {
  private services: Map<ServiceType, Constructor<Service>> = new Map()
  private agent: Agent

  constructor(agent: Agent) {
    this.agent = agent
  }

  use(type: ServiceType, serviceClass: new () => Service): this {
    if (typeof (serviceClass as any).registerDependencies === 'function') {
      // Register the dependencies provided by the service
      ;(serviceClass as any).registerDependencies(this.agent.container)
    } else {
      throw new Error(
        `${serviceClass.name} must implement registerDependencies method.`
      )
    }

    this.agent.container.bind<Service>(type).to(serviceClass)
    this.services.set(type, serviceClass)
    return this
  }
  validateDependencies(): void {
    // Validate that all necessary dependencies are registered
    for (const [serviceName, serviceClass] of this.services.entries()) {
      const deps = (serviceClass as any).dependencies || []
      for (const dep of deps) {
        if (!this.agent.container.isBound(dep)) {
          throw new Error(
            `Dependency ${dep} for service ${serviceName} not registered`
          )
        }
      }
    }
  }

  async initialize(): Promise<void> {
    this.validateDependencies()

    // Initialize each service, resolving them from the container
    for (const [, serviceClass] of this.services.entries()) {
      const service = this.agent.container.resolve(serviceClass)
      await service.apply(this.agent)
    }
  }
}

export { Service, ServiceManager }
