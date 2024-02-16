// DOCUMENTED
import '@feathersjs/transport-commons'
import { Application } from '../declarations'
import { Channel, RealTimeConnection } from '@feathersjs/transport-commons'

/**
 * Configure channels for real-time functionality.
 * @param app - The Feathers application instance.
 */
export default function (app: Application): void {
  // Return early if no real-time functionality has been configured
  if (typeof app.channel !== 'function') {
    return
  }

  const logger = app.get('logger')

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
    logger.debug(`CHANNELS: Login event for ${authResult.user.id}`)
    if (!connection) {
      logger.debug(`CHANNELS: No connection for ${authResult.user.id}`)
      return
    }

    // Remove the connection from the anonymous channel
    app.channel('anonymous').leave(connection)

    if (authResult.sessionId) {
      logger.debug(`CHANNELS: Joining session id ${authResult.sessionId}`)
      const sessionId = authResult.sessionId
      app.channel(sessionId).join(connection)
      return
    }

    logger.debug(
      'CHANNELS: Joining authenticated channel for project %s',
      authResult.project
    )
    app.channel(authResult.project).join(connection)
  })

  /**
   * Configure event publishers for channels.
   * @param data - The event data.
   * @param hook - The hook context.
   */
  app.publish((data: any, context) => {
    // get the user from the context
    if (app.get('environment') !== 'server') return

    const channels = [] as Channel[]

    const sessionId =
      context.params?.sessionId ||
      data.sessionId ||
      data.originalData?.sessionId
    // Session IDs are used when we are running a spell in a session
    // Currently this is only used for the cloud web client
    // DEPIRECATED in favor of channelType/channel in data
    if (sessionId) {
      // conly send the right events up the right channel
      logger.trace(`CHANNELS: Publishing to session ${sessionId}!`)

      // Lets not relay up all the patch events
      if (context.method === 'patch') return

      // Publish all events to the authenticated user channel
      const channel = app.channel(sessionId)
      channels.push(channel)
    }

    // if the channel type is a session, we are running a spell in a session
    // Which mean sthe channel is a session ID we can broadcast to.
    if (data?.event?.channelType === 'session') {
      const channel = app.channel(data.event.channel)
      channels.push(channel)
    }

    // Now we need to check for the agent and broadcast to the agent channel
    const agentId =
      context.params?.agentId ||
      context.result.agentId ||
      context.data?.agentId ||
      data.agentId

    if (agentId) {
      const agentChannel = app.channel(`agent:${agentId}`)
      logger.trace(`CHANNELS: Publishing to agent ${agentId}: ${data.event}`)
      channels.push(agentChannel)
    }

    return channels
  })
}
