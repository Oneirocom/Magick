import { createSelector } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'

import { QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes'
import { rootApi } from './api'
import { GraphData, Spell } from '@magickml/core'

export interface Diff {
  name: string
  diff: Record<string, unknown>
}

export interface PatchArgs {
  spellId: string
  update: Partial<Spell>
}

export interface RunSpell {
  spellId: string
  inputs: Record<string, any>
  state?: Record<string, any>
}

export interface UserSpellArgs {
  spellId: string
}

export const templatesApi = rootApi.injectEndpoints({
  endpoints: builder => ({
    getTemplates: builder.query<Spell[], void>({
      providesTags: ['Templates'],
      query: () => ({
        url: `templates`,
      }),
    }),
  }),
})

const selectSpellResults = templatesApi.endpoints.getTemplates.select()
const emptySpells = Array

export const selectAllSpells = createSelector(
  selectSpellResults,
  spellResult => spellResult?.data || emptySpells
)

export const {
  useGetTemplatesQuery,
} = templatesApi

export const useGetSpellSubscription =
templatesApi.endpoints.getTemplates.useLazyQuerySubscription
