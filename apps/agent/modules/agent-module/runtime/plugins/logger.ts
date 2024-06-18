import { consola } from 'consola'
// import { defineNitroPlugin } from 'nitropack/runtime'

export default defineNitroPlugin(nitroApp => {
  consola.info('Agent Logger Plugin Loaded!')
  nitroApp.hooks.hook('request', event => {
    consola.start(`${event.method} ${event.path}`)
  })

  nitroApp.hooks.hook('error', (event, { body }) => {
    consola.error(event.message, event.message, body)
  })

  nitroApp.hooks.hook('afterResponse', event => {
    consola.success(`${event.method} ${event.path}`)
  })
})
