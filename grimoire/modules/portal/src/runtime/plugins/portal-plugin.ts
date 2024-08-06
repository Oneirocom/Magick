import { defineNovaPlugin } from '@gtc-nova/kit/runtime'
import { useRuntimeConfig } from 'nitro/runtime'
import type { PortalFeatures } from '../../features'
import type { PortalState, UserState } from '../../types'

const POLL_INTERVAL = 60000 // 1 minute

export default defineNovaPlugin<PortalFeatures, any, any, any, any>({
  useRuntimeConfig,
  initialize: (nitro, config) => {
    const portalOptions = config.portal || {}

    return { portalOptions }
  },
  before: async (nitro, br) => {
    const state: PortalState = {
      user: null,
      lastUpdated: null,
    }

    nitro.portal = { state }

    const syncState = async () => {
      // const userState = await $fetch<UserState>('/api/user')
      // TODO: remove this mock for the real thing, ideally pub/sub not polling
      const userState: UserState = {
        id: '1',
        name: 'John Doe',
      }

      if (!userState) {
        console.error('Failed to sync portal state:', userState)
        await nitro.hooks.callHook('portal:error', userState)

        return
      }
      nitro.portal.state.user = userState
      nitro.portal.state.lastUpdated = new Date()
      await nitro.hooks.callHook('portal:updated', nitro.portal.state)
    }

    // Initial sync
    await syncState()

    // Set up polling
    setInterval(syncState, POLL_INTERVAL)
  },

  runtimeSetup: {},
  after: (nitro, br) => {
    console.info(
      'Portal module initialized. Use nitro.portal to access state and hooks.'
    )
  },
})
