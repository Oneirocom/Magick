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

// Expose the contextApi object to the window object
contextBridge.exposeInMainWorld('CapacitorCustomPlatform', {
  name: 'electron',
  plugins: contextApi,
});