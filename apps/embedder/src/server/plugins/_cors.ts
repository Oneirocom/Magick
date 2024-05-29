import { handleCors } from 'h3'
import { defineNitroPlugin } from 'nitropack/runtime'

export default defineNitroPlugin(nitroApp => {
  nitroApp.hooks.hook('request', event => {
    handleCors(event, {
      origin: origin =>
        origin === 'http://localhost:4000' ||
        origin === 'http://localhost:3000',
      methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
      credentials: true,
    })

    // End the response early for OPTIONS requests
    if (event.node.req.method === 'OPTIONS') {
      event.node.res.statusCode = 204
      event.node.res.end()
      return
    }
  })
})
