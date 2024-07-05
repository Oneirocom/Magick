import { Agent } from '../Agent'
import { Constructor } from './DIContainer'

interface Service<T = any> {
  apply(agent: Agent): void | Promise<void>
  getDependencies?(agent?: Agent): Map<string, T>
  dependencies?: string[]
}

function Service(dependencies: string[] = []) {
  return function <T extends { new (...args: any[]): Service }>(
    constructor: T
  ): T {
    return class extends constructor {
      static readonly __service = true
      static readonly dependencies = dependencies
      static readonly serviceName = constructor.name
    } as T
  }
}

class ServiceManager {
  private services: Map<string, Constructor<Service>> = new Map()
  private agent: Agent

  constructor(agent: Agent) {
    this.agent = agent
  }

  use(serviceClass: new () => Service): this {
    if ((serviceClass as any).__service) {
      const serviceName = (serviceClass as any).serviceName
      this.services.set(serviceName, serviceClass)
      const service = new serviceClass()
      const dependencies = service.getDependencies
        ? service.getDependencies(this.agent)
        : new Map()
      for (const [key, value] of dependencies.entries()) {
        this.agent.di.register(key, value)
      }
    } else {
      throw new Error('Invalid service')
    }
    return this
  }

  validateDependencies(): void {
    for (const [serviceName, serviceClass] of this.services.entries()) {
      const deps = (serviceClass as any).dependencies || []
      for (const dep of deps) {
        if (!this.services.has(dep)) {
          throw new Error(
            `Dependency ${dep} for service ${serviceName} not registered`
          )
        }
      }
    }
  }

  async initialize(): Promise<void> {
    this.validateDependencies()

    const appliedServices = new Set<string>()
    const servicesToApply = Array.from(this.services.entries())

    while (servicesToApply.length > 0) {
      const [serviceName, ServiceClass] = servicesToApply.shift()!
      const deps = (ServiceClass as any).dependencies || []

      if (deps.every((dep: string) => appliedServices.has(dep))) {
        const service = new ServiceClass()
        await service.apply(this.agent)
        appliedServices.add(serviceName)
      } else {
        servicesToApply.push([serviceName, ServiceClass])
      }

      if (
        servicesToApply.length === 1 &&
        !appliedServices.has(servicesToApply[0][0])
      ) {
        throw new Error(
          `Circular dependency detected: ${servicesToApply[0][0]}`
        )
      }
    }
  }
}

export { Service, ServiceManager }
