import { useNitroApp } from 'nitro/runtime'
import type { UserState } from '../../types'

export function usePortalState() {
  const nitroApp = useNitroApp()
  return nitroApp.portal.state
}

export async function updateUserState(newState: Partial<UserState>) {
  const nitroApp = useNitroApp()
  if (nitroApp.portal.state.user) {
    nitroApp.portal.state.user = { ...nitroApp.portal.state.user, ...newState }
    nitroApp.portal.state.lastUpdated = new Date()
    await nitroApp.hooks.callHook('portal:updated', nitroApp.portal.state)
  }
}
