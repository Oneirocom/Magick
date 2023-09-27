// DOCUMENTED
import AvatarIcon from '@mui/icons-material/AccountCircle'
import App from './App'

/**
 * This module provides an AvatarPlugin to be used
 * with the @magickml/core client-side library.
 * @module AvatarPlugin
 */

import { ClientPlugin } from 'shared/core'

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
      tooltip: 'Chat with your agents embodied with a 3D avatar',
    },
  ],
  clientRoutes: [
    {
      path: '/avatar',
      component: App,
      plugin: 'AvatarPlugin',
    },
  ],
})

export default AvatarPlugin // Export the AvatarPlugin class.
