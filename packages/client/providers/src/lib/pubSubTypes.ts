export type PubSubEvents = {
  ADD_SUBSPELL: string
  UPDATE_SUBSPELL: string
  DELETE_SUBSPELL: string
  OPEN_TAB: string
  TOGGLE_SNAP: string
  RUN_AGENT: string
  SEND_COMMAND: string
  TOGGLE_FILE_DRAWER: string
  MESSAGE_AGENT: string
  RESET_NODE_STATE: string
  $SUBSPELL_UPDATED: (spellName: string) => string
  $TRIGGER: (tabId: string, nodeId?: number) => string
  $RESET_HIGHLIGHTS: (tabId: string) => string
  $PLAYTEST_INPUT: (tabId: string) => string
  $PLAYTEST_PRINT: (tabId: string) => string
  $DEBUG_PRINT: (tabId: string) => string
  $DEBUG_INPUT: (tabId: string) => string
  $INSPECTOR_SET: (tabId: string) => string
  $TEXT_EDITOR_SET: (tabId: string) => string
  $TEXT_EDITOR_CLEAR: (tabId: string) => string
  $CLOSE_EDITOR: (tabId: string) => string
  $NODE_SET: (tabId: string, nodeId: number) => string
  $SAVE_SPELL: (tabId: string) => string
  $SAVE_SPELL_DIFF: (tabId: string) => string
  $CREATE_MESSAGE_REACTION_EDITOR: (tabId: string) => string
  $CREATE_PLAYTEST: (tabId: string) => string
  $CREATE_INSPECTOR: (tabId: string) => string
  $CREATE_TEXT_EDITOR: (tabId: string) => string
  $CREATE_AGENT_CONTROLS: (tabId: string) => string
  $CREATE_DEBUG_CONSOLE: (tabId: string) => string
  $CREATE_CONSOLE: (tabId: string) => string
  $RUN_SPELL: (tabId?: string) => string
  $PROCESS: (tabId: string) => string
  $EXPORT: (tabId: string) => string
  $UNDO: (tabId: string) => string
  $REDO: (tabId: string) => string
  $DELETE: (tabId: string) => string
  $MULTI_SELECT_COPY: (tabId: string) => string
  $MULTI_SELECT_PASTE: (tabId: string) => string
  $REFRESH_EVENT_TABLE: (tabId: string) => string
  $RUN_AGENT: (tabId: string) => string
}

export interface PubSubContext {
  publish: (event: string, data?: PubSubData) => boolean
  // eslint-disable-next-line @typescript-eslint/ban-types
  subscribe(event: string, func: PubSubJS.SubscriptionListener<any>): () => void
  PubSub: typeof PubSub
  events: PubSubEvents
}

export type PubSubData = Record<string, unknown> | string | unknown[]
export type PubSubCallback = (event: string, data: PubSubData) => void
