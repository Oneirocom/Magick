// DOCUMENTED 
/**
 * This module provides an AvatarPlugin to be used 
 * with the @magickml/engine client-side library.
 * @module AvatarPlugin
 */

import { ClientPlugin } from '@magickml/engine'

/**
 * Represents a new avatar system.
 * @class AvatarPlugin
 */
const AvatarPlugin = new ClientPlugin({
  name: 'AvatarPlugin',
  agentComponents: [], // List of agent components for the plugin
  drawerItems: [], // List of drawer items for the plugin
  clientRoutes: [], // List of client routes for the plugin
  secrets: [] // List of secret keys for the plugin
})

export default AvatarPlugin // Export the AvatarPlugin class.