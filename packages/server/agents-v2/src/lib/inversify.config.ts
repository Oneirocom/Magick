import { Container } from 'inversify'
import { ServiceType, DEFAULT_SERVICES } from './interfaces/types'
import { Service } from './core/service'

const container = new Container()

// Dynamically bind all default services
;(Object.keys(DEFAULT_SERVICES) as ServiceType[]).forEach(serviceType => {
  container.bind<Service<any>>(serviceType).to(DEFAULT_SERVICES[serviceType])
})

export { container }
