// GENERATED 
import {
  Application,
  feathers,
  TransportConnection,
} from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import type { SocketService } from '@feathersjs/socketio-client';
import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

import { LoadingScreen } from '@magickml/client-core';
import { useConfig } from './ConfigProvider';
import { SpellInterface } from '@magickml/engine';

/**
 * SaveDiffData type definition.
 */
type SaveDiffData = {
  name: string;
  diff: Record<string, any>;
  projectId: string;
};

/**
 * SaveDiffParams type definition.
 */
type SaveDiffParams = Record<string, any>;

/**
 * ServiceTypes type definition.
 */
type ServiceTypes = {
  // The type is a Socket service extended with custom methods
  spells: SocketService & {
    saveDiff(data: SaveDiffData, params: SaveDiffParams): Promise<SpellInterface>;
  };
};

/**
 * Configure custom services.
 *
 * @param app - Feathers application instance
 * @param socketClient - TransportConnection instance
 */
const configureCustomServices = (
  app: Application<any, any>,
  socketClient: TransportConnection<any>,
): void => {
  app.use('spells', socketClient.service('spells'), {
    methods: ['find', 'get', 'create', 'patch', 'remove', 'saveDiff'],
  });
};

/**
 * Build Feathers client connection.
 *
 * @param config - Application configuration object.
 * @param token - API token.
 * @returns Feathers client
 */
const buildFeathersClient = async (config, token): Promise<any> => {
  const socket = io(config.apiUrl, {
    // Send the authorization header in the initial connection request
    transportOptions: {
      polling: {
        extraHeaders: {
          authorization: `Bearer ${token}`,
        },
      },
    },
  });
  const app = feathers<ServiceTypes>();
  const socketClient = socketio(socket, { timeout: 10000 });
  // todo this needs more than an<any> here.  Super hacky.
  app.configure(socketClient as any);

  configureCustomServices(app, socketClient);

  // No idea how to type feathers to add io properties to root client.
  return app as any;
};

interface FeathersContext {
  client: any | null;
}

/**
 * Feathers Context definition
 */
const Context = createContext<FeathersContext>(undefined!);

/**
 * Custom hook for Feathers Context
 */
export const useFeathers = ():FeathersContext => useContext(Context);

/**
 * FeathersProvider component
 * @props children, token
 */
const FeathersProvider = ({ children, token }): JSX.Element => {
  const config = useConfig();
  const [client, setClient] = useState<FeathersContext['client']>(null);

  useEffect(() => {
    ;(async (): Promise<void> => {
      const client = await buildFeathersClient(config, token);

      client.io.on('connect', (): void => {
        setClient(client);
      });

      client.io.on('reconnect', (): void => {
        console.log('Reconnected to the server');
        setClient(client);
      });

      client.io.on('disconnect', (): void => {
        console.log("We've been disconnected from the server");
        setTimeout((): void => {
          console.log('Reconnecting...');
          client.io.connect();
        }, 1000);
      });

      client.io.on('error', (error): void => {
        console.log(`Connection error: ${error} \n trying to reconnect...`);
        setTimeout((): void => {
          console.log('Reconnecting...');
          client.io.connect();
        }, 1000);
      });
    })();
  }, []);

  const publicInterface: FeathersContext = {
    client,
  };

  if (!client) return <LoadingScreen />;

  return (
    <Context.Provider value={publicInterface}>{children}</Context.Provider>
  );
};

const ConditionalProvider = (props): JSX.Element => {
  return <FeathersProvider {...props} />;
};

export default ConditionalProvider;
