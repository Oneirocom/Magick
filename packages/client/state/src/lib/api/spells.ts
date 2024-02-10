// DOCUMENTED
import { RootState } from '../store'
import { rootApi } from './api'
import md5 from 'md5'

/**
 * @interface Diff represents a spell diff.
 */
export interface Diff {
  name: string
  diff: Record<string, unknown>
}

/**
 * @interface PatchArgs represents arguments for patching a spell.
 */
export interface PatchArgs {
  spellName: string
  update: Partial<any>
}

/**
 * @interface UserSpellArgs represents arguments for user spell.
 */
export interface UserSpellArgs {
  spellName: string
}

/**
 * @interface SpellData represents spell data pagination.
 */
export interface SpellData {
  limit: number
  skip: number
  total: number
  data: any[]
}

// Reusable function to handle common query logic
// Reusable function to handle common query logic
const makeSpellQueryFn =
  urlConstructor =>
  async (args, { getState }, _, baseQuery) => {
    // Access the spellReleaseId from the globalConfig state
    const spellReleaseId = (getState() as RootState).globalConfig
      .currentSpellReleaseId

    // Construct the URL using the provided function
    const url = urlConstructor(args, spellReleaseId)

    // Make the API request
    const result = await baseQuery({ url })

    // Handle and return the response
    if (result.error) {
      return { error: result.error }
    } else {
      return { data: result.data }
    }
  }

/**
 * @name spellApi Injects API endpoints used for spell management.
 */
export const spellApi = rootApi.injectEndpoints({
  endpoints: builder => ({
    // Api endpoint for getting spells
    getSpells: builder.query({
      providesTags: ['Spells'],
      queryFn: makeSpellQueryFn(
        (_, spellReleaseId) => `spells?spellReleaseId=${spellReleaseId || null}`
      ),
    }),
    getSpellsByReleaseId: builder.query({
      providesTags: ['Spells'],
      query: ({ spellReleaseId }) => ({
        url: `spells?spellReleaseId=${spellReleaseId}`,
      }),
    }),
    getSpell: builder.query({
      providesTags: ['Spell'],
      queryFn: makeSpellQueryFn(({ id }) => `spells/${id}`),
    }),
    // Api endpoint for getting a spell by name
    getSpellByName: builder.query({
      providesTags: ['Spell'],
      queryFn: makeSpellQueryFn(
        ({ spellName }, spellReleaseId) =>
          `spells?name=${spellName}&spellReleaseId=${spellReleaseId || null}`
      ),
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
      query: diffData => ({
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
      query({ spell, projectId }) {
        const spellCopy = { ...spell } as any
        if (spellCopy.id) delete spellCopy.id
        if (Object.keys(spellCopy).includes('modules')) delete spellCopy.modules
        if (!spellCopy.createdAt) spellCopy.createdAt = new Date().toISOString()
        spellCopy.updatedAt = new Date().toISOString()
        spellCopy.projectId = spell.projectId ?? projectId

        delete spellCopy.creatorId

        return {
          url: 'spells/' + spell.id,
          body: spellCopy,
          method: 'PATCH',
        }
      },
    }),
    // Api endpoint for creating a new spell
    newSpell: builder.mutation({
      invalidatesTags: ['Spells'],
      query: spellData => ({
        url: 'spells',
        method: 'POST',
        body: spellData,
      }),
    }),
    // Api endpoint for patching a spell
    patchSpell: builder.mutation({
      invalidatesTags: ['Spell', 'Spells'],
      query({ id, update }) {
        return {
          url: `spells/${id}`,
          body: {
            ...update,
          },
          method: 'PATCH',
        }
      },
    }),
    // Api endpoint for deleting a spell
    deleteSpell: builder.mutation({
      invalidatesTags: ['Spells'],
      query: ({ spellId }) => ({
        url: `spells/${spellId}`,
        method: 'DELETE',
      }),
    }),
  }),
})

// Export the generated hooks for each API endpoint
export const {
  useGetSpellsQuery,
  useGetSpellsByReleaseIdQuery,
  useLazyGetSpellsQuery,
  useLazyGetSpellQuery,
  useGetSpellQuery,
  useGetSpellByNameQuery,
  useLazyGetSpellByNameQuery,
  useRunSpellMutation,
  useSaveDiffMutation,
  useSpellExistsMutation,
  useSaveSpellMutation,
  useNewSpellMutation,
  usePatchSpellMutation,
  useDeleteSpellMutation,
} = spellApi
