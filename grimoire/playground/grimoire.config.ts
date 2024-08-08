import { defineGrimoireConfig } from '@magickml/grimoire/config'

export default defineGrimoireConfig({
  agent: {
    id: '0f0de84c-e34e-4726-9950-9464abe1ffb2',
    name: 'my-agent',
    projectId: '58577f86-b4bf-44d1-8f37-76e2418d6392',
    enabled: true,
    version: '2.0',
    description: 'My agent',
    image: 'https://via.placeholder.com/150',
  },
  nitro: {
    compatibilityDate: '2024-08-01',
  },
})
