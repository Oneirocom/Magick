// GENERATED 
/**
 * Initializes the application and starts the agent.
 * This file initializes the application and starts the agent, then loads the app's plugins and logs them.
 * @packageDocumentation
 */

import 'regenerator-runtime/runtime';
import { pluginManager, WorldManager } from '@magickml/engine';
import { AgentManager } from '@magickml/server-core';

/**
 * Asynchronously loads the application's plugins and logs their names.
 * @returns A `Promise` that resolves when the plugins have been loaded.
 */
async function loadPlugins(): Promise<void> {
  // Import the plugins and get the default exports.
  const pluginExports = (await import('./plugins')).default;

  // Log the loaded plugin names.
  const pluginNames = Object.values(pluginExports).map((p: any) => p.name).join(', ');
  console.log('Loaded plugins on agent:', pluginNames);
}

/**
 * Initializes the application and starts the agent.
 * @returns A `Promise` that resolves when the application is initialized.
 */
async function initializeAgent(): Promise<void> {
  await loadPlugins();

  const agentManager = new AgentManager();
  const worldManager = new WorldManager();

  console.log('AGENT: Starting...');
}

// Initialize the application and start the agent.
initializeAgent();