// DOCUMENTED 
import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { rootApi } from './api';
import { SpellInterface } from '@magickml/core';
import md5 from 'md5';

/**
 * @interface Diff represents a spell diff.
 */
export interface Diff {
  name: string;
  diff: Record<string, unknown>;
}

/**
 * @interface PatchArgs represents arguments for patching a spell.
 */
export interface PatchArgs {
  spellName: string;
  update: Partial<SpellInterface>;
}

/**
 * @interface UserSpellArgs represents arguments for user spell.
 */
export interface UserSpellArgs {
  spellName: string;
}

/**
 * @interface SpellData represents spell data pagination.
 */
export interface SpellData {
  limit: number;
  skip: number;
  total: number;
  data: SpellInterface[];
}

/**
 * @name spellApi Injects API endpoints used for spell management.
 */
export const spellApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    // Api endpoint for getting spells
    getSpells: builder.query({
      providesTags: ['Spells'],
      query: ({ projectId }) => ({
        url: `spells?projectId=${projectId}`,
      }),
    }),
    // Api endpoint for getting a spell by name
    getSpell: builder.query({
      providesTags: ['Spell'],
      query: ({ spellName, projectId }) => {
        return {
          url: `spells?name=${spellName}&projectId=${projectId}`,
          params: {},
        };
      },
    }),
    // Api endpoint for getting a spell by name and ID
    getSpellById: builder.query({
      providesTags: ['Spell'],
      query: ({ spellName, projectId, id }) => {
        return {
          url: `spells?name=${spellName}&projectId=${projectId}&id=${id}`,
          params: {},
        };
      },
    }),
    // Api endpoint for getting a spell by ID only
    getSpellByJustId: builder.query({
      providesTags: ['Spell'],
      query: ({ projectId, id }) => {
        return {
          url: `spells?projectId=${projectId}&id=${id}`,
          params: {},
        };
      },
    }),
    // Api endpoint for running a spell
    runSpell: builder.mutation({
      query: ({ spellName, inputs, state = {}, projectId }) => ({
        url: `spells/${spellName}`,
        method: 'POST',
        body: {
          ...inputs,
          state,
          projectId,
        },
      }),
    }),
    // Api endpoint for saving a spell diff
    saveDiff: builder.mutation({
      invalidatesTags: ['Spell'],
      query: (diffData) => ({
        url: 'spells/saveDiff',
        method: 'POST',
        body: diffData,
      }),
    }),
    // Api endpoint for checking if a spell exists
    spellExists: builder.mutation({
      query: ({ name, projectId }) => ({
        url: 'spells/exists',
        method: 'GET',
        body: {
          name,
          projectId,
        },
      }),
    }),
    // Api endpoint for saving a spell
    saveSpell: builder.mutation({
      invalidatesTags: ['Spell'],
      async queryFn(
        { spell, projectId },
        { dispatch },
        extraOptions,
        baseQuery
      ) {
        const spellCopy = { ...spell } as any;
        if (spellCopy.id) delete spellCopy.id;
        if (Object.keys(spellCopy).includes('modules'))
          delete spellCopy.modules;
        if (!spellCopy.createdAt)
          spellCopy.createdAt = new Date().toISOString();
        spellCopy.updatedAt = new Date().toISOString();
        spellCopy.projectId = spell.projectId ?? projectId;
        spellCopy.hash = md5(JSON.stringify(spellCopy.graph.nodes));

        delete spellCopy.creatorId

        const baseQueryOptions = {
          url: 'spells/' + spell.id,
          body: spellCopy,
          method: 'PATCH',
        };

        return baseQuery(baseQueryOptions) as QueryReturnValue<
          Partial<SpellInterface>,
          FetchBaseQueryError,
          unknown
        >;
      },
    }),
    // Api endpoint for creating a new spell
    newSpell: builder.mutation({
      invalidatesTags: ['Spells'],
      query: (spellData) => ({
        url: 'spells',
        method: 'POST',
        body: spellData,
      }),
    }),
    // Api endpoint for patching a spell
    patchSpell: builder.mutation({
      invalidatesTags: ['Spell'],
      query({ id, update }) {
        return {
          url: `spells/${id}`,
          body: {
            ...update,
          },
          method: 'PATCH',
        };
      },
    }),
    // Api endpoint for deleting a spell
    deleteSpell: builder.mutation({
      invalidatesTags: ['Spells'],
      query: ({ spellName }) => ({
        url: `spells/${spellName}`,
        method: 'DELETE',
      }),
    }),
  }),
});

// Export the generated hooks for each API endpoint
export const {
  useGetSpellsQuery,
  useLazyGetSpellsQuery,
  useLazyGetSpellQuery,
  useLazyGetSpellByIdQuery,
  useGetSpellQuery,
  useGetSpellByIdQuery,
  useGetSpellByJustIdQuery,
  useRunSpellMutation,
  useSaveDiffMutation,
  useSpellExistsMutation,
  useSaveSpellMutation,
  useNewSpellMutation,
  usePatchSpellMutation,
  useDeleteSpellMutation,
} = spellApi;