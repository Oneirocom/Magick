import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react'

import { QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes'
import { getRootApi } from './api'
import { Spell } from '@magickml/engine'

import md5 from 'md5'

export interface Diff {
  name: string
  diff: Record<string, unknown>
}

export interface PatchArgs {
  spellName: string
  update: Partial<Spell>
}

export interface RunSpell {
  spellName: string
  inputs: Record<string, any>
  state?: Record<string, any>
}

export interface UserSpellArgs {
  spellName: string
}

export interface SpellData {
  limit: number
  skip: number
  total: number
  data: Spell[]
}

let spellApi: any = null;
export const getSpellApi = (config) => {
  if(spellApi) return spellApi;
  const rootApi = getRootApi(config);
  spellApi = rootApi.injectEndpoints({
    endpoints: builder => ({
      getSpells: builder.query({
        providesTags: ['Spells'],
        query: ({ projectId }) => ({
          url: `spells?projectId=${projectId}`,
        }),
      }),
      getSpell: builder.query({
        providesTags: ['Spell'],
        query: ({ spellName, projectId }) => {
          return {
            url: `spells?name=${spellName}&projectId=${projectId}`,
            params: {},
          }
        },
      }),
      runSpell: builder.mutation({
        query: ({ spellName, inputs, state = {}, projectId }) => ({
          url: `spells/${spellName}`,
          method: 'POST',
          body: {
            ...inputs,
            state,
            projectId
          },
        }),
      }),
      saveDiff: builder.mutation({
        invalidatesTags: ['Spell'],
        query: diffData => ({
          url: 'spells/saveDiff',
          method: 'POST',
          body: diffData,
        }),
      }),
      spellExists: builder.mutation({
        query: name => ({
          url: 'spells/exists',
          method: 'POST',
          body: {
            name,
          },
        }),
      }),
      saveSpell: builder.mutation({
        invalidatesTags: ['Spell'],
        // needed to use queryFn as query option didnt seem to allow async functions.
        async queryFn({ spell, projectId, }, { dispatch }, extraOptions, baseQuery) {
          // make a copy of spell but remove the id
          const spellCopy = { ...spell } as any
          if (spellCopy.id) delete spellCopy.id
          if (Object.keys(spellCopy).includes('modules')) delete spellCopy.modules
          if (!spellCopy.created_at)
            spellCopy.created_at = new Date().toISOString()
          spellCopy.updated_at = new Date().toISOString()
          spellCopy.projectId = spell.projectId ?? projectId
          spellCopy.hash = md5(JSON.stringify(spellCopy.graph.nodes))
          console.log('SAVING SPELL')
          const baseQueryOptions = {
            url: 'spells/' + spell.id,
            body: spellCopy,
            method: 'PATCH',
          }

          // cast into proper response shape expected by queryFn return
          // probbably a way to directly pass in type args to baseQuery but couldnt find.
          return baseQuery(baseQueryOptions) as QueryReturnValue<
            Partial<Spell>,
            FetchBaseQueryError,
            unknown
          >
        },
      }),
      newSpell: builder.mutation({
        invalidatesTags: ['Spells'],
        query: spellData => ({
          url: 'spells',
          method: 'POST',
          body: spellData,
        }),
      }),
      patchSpell: builder.mutation({
        invalidatesTags: ['Spell'],
        query({ spellName, update }) {
          return {
            url: `spells/${spellName}`,
            body: {
              ...update,
            },
            method: 'PATCH',
          }
        },
      }),
      deleteSpell: builder.mutation({
        invalidatesTags: ['Spells'],
        query: ({ spellName }) => ({
          url: `spells/${spellName}`,
          method: 'DELETE',
        }),
      }),
    }),
  })
  return spellApi;
}
