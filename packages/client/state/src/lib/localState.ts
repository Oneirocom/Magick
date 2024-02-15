// DOCUMENTED
import {
  createSlice,
  createDraftSafeSelector,
  createEntityAdapter,
} from '@reduxjs/toolkit'

/**
 * Interface for local state.
 */
export interface LocalState {
  id: string
  playtestData?: string
  chatwindowData?: string
}

// Entity adapter to handle local state operations
const localAdapater = createEntityAdapter<LocalState>({
  selectId: localState => localState.id,
})
const localSelectors = localAdapater.getSelectors()

// Initial State
const initialState = localAdapater.getInitialState()

/**
 * This is the primary slice of our "duck",
 * which returns helper functions and properties.
 */
export const localStateSlice = createSlice({
  name: 'localState',
  initialState,
  reducers: {
    addLocalState: localAdapater.addOne,
    deleteLocalState: localAdapater.removeOne,
    upsertLocalState: localAdapater.upsertOne,
  },
})

// actions
export const { addLocalState, deleteLocalState, upsertLocalState } =
  localStateSlice.actions

// selectors
/* export const selectStateBySpellId = createDraftSafeSelector(
  [state => localSelectors.selectAll(state), (_, spellName) => spellName],
  (states, spellName) =>
    Object.values(states).find(state => state.spellName === spellName)
) */

/**
 * Selector to find a state by tabId.
 */
export const selectStateBytabId = createDraftSafeSelector(
  [state => localSelectors.selectAll(state), (_, id) => id],
  (states, id) => Object.values(states).find(state => state?.id === id)
)

// export the default reducer
export default localStateSlice.reducer
