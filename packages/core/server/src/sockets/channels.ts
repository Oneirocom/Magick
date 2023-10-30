// DOCUMENTED
import '@feathersjs/transport-commons'
import { Application } from '../declarations'
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
    // Return early if there's no real-time connection (e.g. during REST login)
    if (!connection) {
      return
    }

    // Remove the connection from the anonymous channel
    app.channel('anonymous').leave(connection)

    if (authResult.sessionId) {
      const sessionId = authResult.sessionId
      app.channel(sessionId).join(authResult.sessionId)
      return
    }

    app.channel(authResult.project).join(connection)
  })

  /**
   * Configure event publishers for channels.
   * @param data - The event data.
   * @param hook - The hook context.
   */
  app.publish((data: any, context) => {
    // get the user from the context
    if (app.get('isAgent')) return

    // Session IDs are used when we are running a spell in a session
    // Currently this is only used for the cloud web client
    if (data.sessionId) {
      const sessionId = data.sessionId
      // don't publish if we are an agent

      // Lets not relay up all the patch events
      if (context.method === 'patch') return

      // Publish all events to the authenticated user channel
      const channel = app.channel(sessionId)
      return channel
    }

    const projectId =
      context.params?.projectId ||
      context.result.projectId ||
      context.data?.projectId ||
      data.projectId

    // Lets not relay up all the patch events
    if (context.method === 'patch') return

    // Publish all events to the authenticated user channel
    const channel = app.channel(projectId)
    return channel
  })
}
