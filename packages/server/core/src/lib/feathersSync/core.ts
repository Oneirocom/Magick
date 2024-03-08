// core.ts
import debug from 'debug'
import feathers from '@feathersjs/feathers'
import { _ } from '@feathersjs/commons'

const logger = debug('feathers-sync')

export const SYNC = Symbol('feathers-sync/enabled')

const defaultEvents = ['created', 'updated', 'removed', 'patched']

const getServiceOptions = (service: any) => {
  if (typeof feathers.getServiceOptions === 'function') {
    return feathers.getServiceOptions(service)
  }

  return {}
}

export default (app: any) => {
  if (app[SYNC]) {
    return
  }

  app[SYNC] = true

  if (app.sync) {
    throw new Error(
      'Only one type of feathers-sync can be configured on the same application'
    )
  }

  app.on('sync-in', (rawData: any) => {
    const { event, path, data, context } = rawData
    const service = app.service(path)
    const hook = context ? Object.assign({ app, service }, context) : context

    if (service) {
      logger(`Dispatching sync-in event '${path} ${event}'`)
      service._emit(event, data, hook)
    } else {
      logger(`Invalid sync event '${path} ${event}'`)
    }
  })

  app.mixins.push((service: any, path: string) => {
    if (typeof service._emit !== 'function') {
      const { events: customEvents = service.events } =
        getServiceOptions(service)
      const events = defaultEvents.concat(customEvents)

      service._emit = service.emit
      service.emit = function (this: any, event: string, data: any, ctx: any) {
        const disabled = ctx && ctx[SYNC] === false

        if (!events.includes(event) || disabled) {
          logger(`Passing through non-service event '${path} ${event}'`)
          return this._emit(event, data, ctx)
        }

        const serializedContext =
          ctx && typeof ctx.toJSON === 'function' ? ctx.toJSON() : ctx
        const context =
          ctx && (ctx.app === app || ctx.service === service)
            ? _.omit(serializedContext, 'app', 'service', 'self')
            : serializedContext

        logger(`Sending sync-out event '${path} ${event}'`)

        return app.emit(
          'sync-out',
          app.sync.serialize({
            event,
            path,
            data,
            context,
          })
        )
      }
    }
  })
}
