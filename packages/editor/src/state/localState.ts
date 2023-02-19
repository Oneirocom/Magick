import {
  createSlice,
  // PayloadAction,
  createDraftSafeSelector,
  createEntityAdapter,
} from '@reduxjs/toolkit'

export interface LocalState {
  spellName: string
  playtestData: string
}

// Entity adapter
const localAdapater = createEntityAdapter<LocalState>({
  selectId: localState => localState.spellName,
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
  [state => localSelectors.selectAll(state), (_, spellName) => spellName],
  (states, spellName) =>
    Object.values(states).find(state => state.spellName === spellName)
)

export default localStateSlice.reducer
