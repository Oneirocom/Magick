import { Middleware } from '@reduxjs/toolkit'
import { spellApi } from '../api/spells'

export const cacheInvalidationMiddleware: Middleware =
  store => next => action => {
    const result = next(action)

    if (action.type === 'globalConfig/setCurrentSpellReleaseId') {
      // Invalidate specific query cache
      store.dispatch(spellApi.util.invalidateTags(['Spells', 'Spell']))
    }

    return result
  }
