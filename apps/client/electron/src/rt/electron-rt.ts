// DOCUMENTED 
import { randomBytes } from 'crypto';
import { ipcRenderer, contextBridge } from 'electron';
import { EventEmitter } from 'events';

/**
 * Generates a random ID
 * @param length The length of the generated ID (default = 5)
 */
const randomId = (length = 5): string => {
  return randomBytes(length).toString('hex');
};

/**
 * An object which holds all the plugin functions
 * @property plugin - The plugin name
 * @property functionName - The function name
 */
interface ContextApi {
  [plugin: string]: { [functionName: string]: () => Promise<any> };
}

const contextApi: ContextApi = {};

// Loop through plugins
Object.keys(plugins).forEach((pluginKey) => {
  // Loop through each plugin's classes
  Object.keys(plugins[pluginKey])
    .filter((className) => className !== 'default')
    .forEach((classKey) => {
      const functionList = Object.getOwnPropertyNames(plugins[pluginKey][classKey].prototype).filter(
        (v) => v !== 'constructor'
      );

      if (!contextApi[classKey]) {
        contextApi[classKey] = {};
      }

      // Add each function to the contextApi
      functionList.forEach((functionName) => {
        if (!contextApi[classKey][functionName]) {
          contextApi[classKey][functionName] = (...args) => ipcRenderer.invoke(`${classKey}-${functionName}`, ...args);
        }
      });

      // Add event listeners
      if (plugins[pluginKey][classKey].prototype instanceof EventEmitter) {
        const listeners: { [key: string]: { type: string; listener: (...args: any[]) => void } } = {};
        const listenersOfTypeExist = (type: string) =>
          !!Object.values(listeners).find((listenerObj) => listenerObj.type === type);

        Object.assign(contextApi[classKey], {
          /**
           * Add an event listener
           * @param type The event type to listen for
           * @param callback The callback to invoke when the event is received
           * @returns The id of the listener that was added
           */
          addListener(type: string, callback: (...args: any[]) => void): string {
            const id = randomId();

            // Deduplicate events
            if (!listenersOfTypeExist(type)) {
              ipcRenderer.send(`event-add-${classKey}`, type);
            }

            const eventHandler = (_, ...args: any[]) => callback(...args);

            ipcRenderer.addListener(`event-${classKey}-${type}`, eventHandler);
            listeners[id] = { type, listener: eventHandler };

            return id;
          },

          /**
           * Remove a specific event listener
           * @param id The id of the listener to remove
           */
          removeListener(id: string): void {
            if (!listeners[id]) {
              throw new Error('Invalid id');
            }

            const { type, listener } = listeners[id];

            ipcRenderer.removeListener(`event-${classKey}-${type}`, listener);

            delete listeners[id];

            if (!listenersOfTypeExist(type)) {
              ipcRenderer.send(`event-remove-${classKey}-${type}`);
            }
          },

          /**
           * Remove all event listeners of a specific type
           * @param type The type of the listeners to remove
           */
          removeAllListeners(type: string): void {
            Object.entries(listeners).forEach(([id, listenerObj]) => {
              if (listenerObj.type === type) {
                ipcRenderer.removeListener(`event-${classKey}-${type}`, listenerObj.listener);
                delete listeners[id];
              }
            });

            ipcRenderer.send(`event-remove-${classKey}-${type}`);
          },
        });
      }
    });
});

// Expose the contextApi object to the window object
contextBridge.exposeInMainWorld('CapacitorCustomPlatform', {
  name: 'electron',
  plugins: contextApi,
});