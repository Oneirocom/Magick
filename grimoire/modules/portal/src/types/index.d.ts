import { Hookable } from 'hookable'
import type { NitroApp, NitroRuntimeHooks } from 'nitro/types'

export interface UserState {
  id: string
  name: string
}

export interface PortalState {
  user: UserState | null
  lastUpdated: Date | null
}

declare module 'nitro/types' {
  interface NitroApp {
    portal: {
      state: PortalState
    }
  }
  interface NitroRuntimeHooks {
    'portal:updated': (state: PortalState) => void | Promise<void>
    'portal:error': (error: Error) => void | Promise<void>
  }
}
