import {
  createSlice,
  // PayloadAction,
  createDraftSafeSelector,
  createEntityAdapter,
} from '@reduxjs/toolkit'

export interface LocalState {
  spellId: string
  playtestData: string
}

// Entity adapter
const localAdapater = createEntityAdapter<LocalState>({
  selectId: localState => localState.spellId,
})
const localSelectors = localAdapater.getSelectors()

// Initial State
const initialState = localAdapater.getInitialState()

// This is the primary composed of our "duck", and returns a number of helper functions and properties.
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
export const selectStateBySpellId = createDraftSafeSelector(
  [state => localSelectors.selectAll(state), (_, spellId) => spellId],
  (states, spellId) =>
    Object.values(states).find(state => state.spellId === spellId)
)

export default localStateSlice.reducer
