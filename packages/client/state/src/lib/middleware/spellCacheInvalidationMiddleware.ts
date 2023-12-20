import { Middleware } from '@reduxjs/toolkit'
import { spellApi } from '../api/spells'

export const cacheInvalidationMiddleware: Middleware =
  store => next => action => {
    if (
      action.type === 'globalConfig/setCurrentSpellReleaseId' ||
      action.type === 'globalConfig/setCurrentAgentId'
    ) {
      // Invalidate specific query cache
      store.dispatch(spellApi.util.invalidateTags(['Spells', 'Spell']))
    }

    return next(action)
  }
