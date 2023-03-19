/* eslint-disable @typescript-eslint/no-unused-vars */
import { PubSubData } from '@magickml/engine';
import PubSub from 'pubsub-js'
import { useContext, createContext } from 'react'

export interface PubSubContext {
  publish: (event: string, data?: PubSubData) => boolean
  // eslint-disable-next-line @typescript-eslint/ban-types
  subscribe(event: string, func: PubSubJS.SubscriptionListener<PubSubData>): () => void;
  PubSub: typeof PubSub
  events: Record<string, any>
}

// TODO: does it also work without the !?
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const Context = createContext<PubSubContext>(undefined!)

export const usePubSub = () => useContext<PubSubContext>(Context)

export { PubSub }

// Might want to namespace these
export const events = {
  ADD_SUBSPELL: 'addSubspell',
  UPDATE_SUBSPELL: 'updateSubspell',
  DELETE_SUBSPELL: 'deleteSubspell',
  OPEN_TAB: 'openTab',
  $SUBSPELL_UPDATED: spellName => `subspellUpdated:${spellName}`,
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
  $CREATE_AVATAR_WINDOW: tabId => `createAvatarWindow:${tabId}`,
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
  $SEND_TO_AVATAR: tabId => `sendToAvatar:${tabId}`,
}

const PubSubProvider = ({ children }) => {
  const publish = (event, data) => {
    return PubSub.publish(event, data)
  }

  const subscribe = (event: string, callback: PubSubJS.SubscriptionListener<PubSubData>): () => void => {
    const token = PubSub.subscribe(event, callback)

    return () => {
      PubSub.unsubscribe(token)
    }
  }

  const publicInterface = {
    publish,
    subscribe,
    events,
    PubSub,
  }

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

export default PubSubProvider
