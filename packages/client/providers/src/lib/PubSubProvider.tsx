'use client'

// Import required modules
import { PubSubContext, PubSubData, PubSubEvents } from './pubSubTypes'
import PubSub from 'pubsub-js'
import { createContext, useContext, useEffect, useRef } from 'react'
import { useFeathers } from './FeathersProvider'
import { useSelector } from 'react-redux'
import { RootState } from 'client/state'

// Create new context for PubSub
const Context = createContext<PubSubContext>(undefined!)

// Custom hook to access the PubSub context
export const usePubSub = () => useContext<PubSubContext>(Context)

export { PubSub }

// Define the PubSub events
export const events: PubSubEvents = {
  // $CREATE_PROJECT_WINDOW: tabId => `createProjectWindow:${tabId}`,
  $CHAT_TO_INPUT: tabId => `chatToInput:${tabId}`,
  $CLOSE_EDITOR: tabId => `closeEditor:${tabId}`,
  $CREATE_AGENT_CONTROLS: tabId => `createAgentControls:${tabId}`,
  $CREATE_CONSOLE: tabId => `createDebugConsole:${tabId}`,
  $CREATE_DEBUG_CONSOLE: tabId => `createDebugConsole:${tabId}`,
  $CREATE_INSPECTOR: tabId => `createInspector:${tabId}`,
  $CREATE_MESSAGE_REACTION_EDITOR: tabId =>
    `createMessageReactionEditor:${tabId}`,
  $CREATE_PLAYTEST: tabId => `createPlaytest:${tabId}`,
  $CREATE_TEXT_EDITOR: tabId => `createTextEditor:${tabId}`,
  $DEBUG_INPUT: tabId => `debugInput:${tabId}`,
  $DEBUG_PRINT: tabId => `debugPrint:${tabId}`,
  $DELETE: tabId => `delete:${tabId}`,
  $EXPORT: tabId => `export:${tabId}`,
  $EXPORT_AGENT: tabId => `exportAgent:${tabId}`,
  $INPUT_TO_CHAT: tabId => `inputToChat:${tabId}`,
  $INSPECTOR_SET: tabId => `inspectorSet:${tabId}`,
  $MULTI_SELECT_COPY: tabId => `multiSelectCopy:${tabId}`,
  $MULTI_SELECT_PASTE: tabId => `multiSelectPaste:${tabId}`,
  $NODE_SET: (tabId, nodeId) => `nodeSet:${tabId}:${nodeId}`,
  $PLAYTEST_INPUT: tabId => `playtestInput:${tabId}`,
  $PLAYTEST_PRINT: tabId => `playtestPrint:${tabId}`,
  $PROCESS: tabId => `process:${tabId}`,
  $REDO: tabId => `redo:${tabId}`,
  $REFRESH_EVENT_TABLE: tabId => `refreshEventTable:${tabId}`,
  $RELOAD_GRAPH: tabId => `reloadGraph:${tabId}`,
  $RESET_HIGHLIGHTS: tabId => `resetHighlights:${tabId}`,
  $RUN_AGENT: tabId => `runAgent:${tabId}`,
  $RUN_SPELL: tabId => `runSpell:${tabId}`,
  $SAVE_SPELL_DIFF: tabId => `saveSpellDiff:${tabId}`,
  $SAVE_SPELL: tabId => `saveSpell:${tabId}`,
  $SERAPH_EVENT: tabId => `seraphEvent:${tabId}`,
  $SUBSPELL_UPDATED: spellId => `subspellUpdated:${spellId}`,
  $TEXT_EDITOR_CLEAR: tabId => `textEditorClear:${tabId}`,
  $TEXT_EDITOR_SET: tabId => `textEditorSet:${tabId}`,
  $TRIGGER: (tabId, nodeId) => `triggerNode:${tabId}:${nodeId ?? 'default'}`,
  $UNDO: tabId => `undo:${tabId}`,
  ADD_SUBSPELL: 'addSubspell',
  DELETE_SUBSPELL: 'deleteSubspell',
  MESSAGE_AGENT: 'messageAgent',
  OPEN_TAB: 'openTab',
  RESET_NODE_STATE: 'resetNodeState',
  RUN_AGENT: 'runAgent',
  SEND_COMMAND: 'sendCommand',
  TOGGLE_FILE_DRAWER: 'toggleFileDrawer',
  TOGGLE_RIGHT_PANEL: 'toggleRightPanel',
  TOGGLE_SNAP: 'toggleSnap',
  UPDATE_SUBSPELL: 'updateSubspell',
}

// Create the PubSubProvider component
export const PubSubProvider = ({ children }: { children: React.ReactNode }) => {
  const { client } = useFeathers()
  const globalConfig = useSelector((state: RootState) => state.globalConfig)
  const globalConfigRef = useRef(globalConfig)

  useEffect(() => {
    if (!globalConfig) return
    globalConfigRef.current = globalConfig
  }, [globalConfig])

  // Publish function
  const publish = (event: string, data?: PubSubData) => {
    return PubSub.publish(event, data)
  }

  // Subscribe function
  const subscribe = (
    event: string,
    callback: PubSubJS.SubscriptionListener<any>
  ): (() => void) => {
    const token = PubSub.subscribe(event, callback)

    return () => {
      PubSub.unsubscribe(token)
    }
  }

  // useHotkeys('ctrl+b,cmd+b', () => {
  //   publish(events.TOGGLE_FILE_DRAWER, {})
  // })

  useEffect(() => {
    if (!client) return

    // temporary subscription to run the agent
    const unsubscribeRun = subscribe(events.RUN_AGENT, (event, data) => {
      client.service('agents').run(data)
    })

    const unsubscribeCommand = subscribe(events.SEND_COMMAND, (event, data) => {
      const command = {
        ...data,
        agentId: globalConfigRef?.current?.currentAgentId,
      }
      client.service('agents').command(command)
    })

    const unsubscribeMessage = subscribe(
      events.MESSAGE_AGENT,
      (event, data) => {
        client.service('agents').message(data)
      }
    )

    return () => {
      unsubscribeRun()
      unsubscribeCommand()
      unsubscribeMessage()
    }
  }, [client])

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
