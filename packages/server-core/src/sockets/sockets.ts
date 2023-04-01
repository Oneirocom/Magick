// DOCUMENTED 
import { DEFAULT_USER_ID, IGNORE_AUTH, SpellManager } from '@magickml/engine';

/**
 * Handle socket connections for the application.
 * @param {any} app - The application instance.
 * @returns {(io: any) => void} - A function that takes an `io` instance and sets up socket connections.
 */
const handleSockets = (app: any) => {
  return (io: any) => {
    /**
     * Set up a connection event listener for incoming sockets.
     */
    io.on('connection', async function (socket: any) {
      console.log('CONNECTION ESTABLISHED');

      // user will be set to the payload if we are not in single user mode
      let user;

      // Single user mode is for local usage. In the cloud, we want auth here.
      if (IGNORE_AUTH) {
        user = {
          id: DEFAULT_USER_ID,
        };
      } else {
        // Use a custom header for the handshake.
        const auth = socket.handshake?.headers?.authorization;
        if (!auth) {
          return console.error('No Authorization header was provided in handshake');
        }

        const sessionId = auth.split(' ')[1];
        if (!sessionId) {
          return console.error('No session id provided for handshake');
        }

        // Auth services will verify the token
        const payload = await app
          .service('authentication')
          .verifyAccessToken(sessionId);

        user = payload.user;
      }
      // Attach the user info to the params for use in services
      socket.feathers.user = user;

      // Instantiate the interface within the runner rather than the spell manager to avoid shared state issues.
      const spellManager = new SpellManager({ socket });

      app.userSpellManagers.set(user.id, spellManager);

      socket.emit('connected');
    });
  };
};

export default handleSockets;