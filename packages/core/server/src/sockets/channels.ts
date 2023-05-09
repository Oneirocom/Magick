// DOCUMENTED
import '@feathersjs/transport-commons'
import { Application } from '../declarations'
import { DEFAULT_USER_ID, IGNORE_AUTH, SpellManager } from '@magickml/core'
import { RealTimeConnection } from '@feathersjs/transport-commons'

/**
 * Configure channels for real-time functionality.
 * @param app - The Feathers application instance.
 */
export default function (app: Application): void {
  // Return early if no real-time functionality has been configured
  if (typeof app.channel !== 'function') {
    return
  }

  /**
   * Handle new real-time connections.
   * @param connection - The new real-time connection.
   */
  app.on(
    'connection',
    async (connection: RealTimeConnection): Promise<void> => {
      console.log('!!!!!connection in connection', connection)
      // Add the new connection to the anonymous channel
      // we assume authenticated user here because they handshook to start
      app.channel('anonymous').join(connection)
      // app.channel('authenticated').join(connection)
    }
  )

  /**
   * Handle user login events.
   * @param authResult - The authentication result.
   * @param connectionData - Contains the connection object.
   */
  app.on('login', (authResult: any, { connection }: any): void => {
    debugger
    // console.log('connection in login', connection)
    // Return early if there's no real-time connection (e.g. during REST login)
    if (!connection) {
      return
    }

    // Remove the connection from the anonymous channel
    app.channel('anonymous').leave(connection)
    app.channel('authenticated').join(connection)

    console.log(
      '!!!!!!!!!!!!!!!!!!!!adding uses to channel',
      authResult.project
    )
    app.channel(authResult.project).join(connection)

    // Additional custom channels can be set up and joined here
  })

  /**
   * Configure event publishers for channels.
   * @param data - The event data.
   * @param hook - The hook context.
   */
  app.publish((data, context) => {
    const projectId =
      context.params?.projectId ||
      context.result.projectId ||
      context.data?.projectId

    // console.log('DATA', data)
    // console.log('PUBLISHING project id', projectId)
    // Publish all events to the authenticated user channel
    const channel = app.channel(projectId)
    // debugger
    return channel
  })
}
