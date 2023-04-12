// DOCUMENTED
/* eslint-disable @-eslint/no-unused-vars */

// Import required modules
import * as React from 'react'
import { PubSubContext, PubSubData, PubSubEvents } from '@magickml/core'
import PubSub from 'pubsub-js'
import { useContext, createContext } from 'react'

// Create new context for PubSub
const Context = createContext<PubSubContext>(undefined)

// Custom hook to access the PubSub context
export const usePubSub = () => useContext<PubSubContext>(Context)

export { PubSub }

// Define the PubSub events
export const events: PubSubEvents = {
  ADD_SUBSPELL: 'addSubspell',
  UPDATE_SUBSPELL: 'updateSubspell',
  DELETE_SUBSPELL: 'deleteSubspell',
  OPEN_TAB: 'openTab',
  $SUBSPELL_UPDATED: spellId => `subspellUpdated:${spellId}`,
  $TRIGGER: (tabId, nodeId) => `triggerNode:${tabId}:${nodeId ?? 'default'}`,
  $PLAYTEST_INPUT: tabId => `playtestInput:${tabId}`,
  $PLAYTEST_PRINT: tabId => `playtestPrint:${tabId}`,
  $DEBUG_PRINT: tabId => `debugPrint:${tabId}`,
  $DEBUG_INPUT: tabId => `debugInput:${tabId}`,
  $INSPECTOR_SET: tabId => `inspectorSet:${tabId}`,
  $TEXT_EDITOR_SET: tabId => `textEditorSet:${tabId}`,
  $TEXT_EDITOR_CLEAR: tabId => `textEditorClear:${tabId}`,
  $CLOSE_EDITOR: tabId => `closeEditor:${tabId}`,
  $NODE_SET: (tabId, nodeId) => `nodeSet:${tabId}:${nodeId}`,
  $SAVE_SPELL: tabId => `saveSpell:${tabId}`,
  $SAVE_SPELL_DIFF: tabId => `saveSpellDiff:${tabId}`,
  $CREATE_MESSAGE_REACTION_EDITOR: tabId =>
    `createMessageReactionEditor:${tabId}`,
  $CREATE_PLAYTEST: tabId => `createPlaytest:${tabId}`,
  $CREATE_INSPECTOR: tabId => `createInspector:${tabId}`,
  $CREATE_TEXT_EDITOR: tabId => `createTextEditor:${tabId}`,
  // $CREATE_PROJECT_WINDOW: tabId => `createProjectWindow:${tabId}`,
  $CREATE_DEBUG_CONSOLE: tabId => `createDebugConsole:${tabId}`,
  $CREATE_CONSOLE: tabId => `createDebugConsole:${tabId}`,
  $RUN_SPELL: tabId => `runSpell:${tabId}`,
  $PROCESS: tabId => `process:${tabId}`,
  $EXPORT: tabId => `export:${tabId}`,
  $UNDO: tabId => `undo:${tabId}`,
  $REDO: tabId => `redo:${tabId}`,
  $DELETE: tabId => `delete:${tabId}`,
  $MULTI_SELECT_COPY: tabId => `multiSelectCopy:${tabId}`,
  $MULTI_SELECT_PASTE: tabId => `multiSelectPaste:${tabId}`,
  $REFRESH_EVENT_TABLE: tabId => `refreshEventTable:${tabId}`,
}

// Create the PubSubProvider component
const PubSubProvider: React.FC = ({ children }) => {
  // Publish function
  const publish = (event: string, data: PubSubData) => {
    return PubSub.publish(event, data)
  }

  // Subscribe function
  const subscribe = (
    event: string,
    callback: PubSubJS.SubscriptionListener<PubSubData>
  ): (() => void) => {
    const token = PubSub.subscribe(event, callback)

    return () => {
      PubSub.unsubscribe(token)
    }
  }

  // Public interface for the provider
  const publicInterface = {
    publish,
    subscribe,
    events,
    PubSub,
  }

  // Return the provider with public interface and pass children
  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

export default PubSubProvider
