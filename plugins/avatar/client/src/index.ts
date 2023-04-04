// DOCUMENTED 
import AvatarIcon from '@mui/icons-material/AccountCircle'
import App from './App'

/**
 * This module provides an AvatarPlugin to be used 
 * with the @magickml/core client-side library.
 * @module AvatarPlugin
 */

import { ClientPlugin } from '@magickml/core'

/**
 * Represents a new avatar system.
 * @class AvatarPlugin
 */
const AvatarPlugin = new ClientPlugin({
  name: 'AvatarPlugin',
  agentComponents: [], // List of agent components for the plugin
  secrets: [], // List of secret keys for the plugin,
  drawerItems: [
    {
      path: '/avatar',
      icon: AvatarIcon,
      text: 'Avatar',
    },
  ],
  clientRoutes: [
    {
      path: '/avatar',
      component: App,
    }
  ],
})

export default AvatarPlugin // Export the AvatarPlugin class.