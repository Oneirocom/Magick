import { defineGrimoireConfig } from '@magickml/grimoire/config'

export default defineGrimoireConfig({
  agent: {
    id: process.env.AGENT_ID,
    name: 'my-agent',
    projectId: 'default',
    enabled: true,
    version: '2.0',
    description: 'My agent',
    image: 'https://via.placeholder.com/150',
  },
  nitro: {
    compatibilityDate: '2024-08-01',
  },
})
