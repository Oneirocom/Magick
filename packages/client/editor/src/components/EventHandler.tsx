// DOCUMENTED
import { useEffect, useRef } from 'react'
import { useSnackbar } from 'notistack'
import { GraphData, SpellInterface } from '@magickml/core'

import md5 from 'md5'

import { useLayout } from '../contexts/LayoutProvider'
import { useEditor } from '../contexts/EditorProvider'
import { diff } from '../utils/json0'

import { useConfig, useFeathers } from 'client/core'
import {
  useLazyGetSpellByIdQuery,
  useSaveSpellMutation,
  RootState,
} from 'client/state'
import { useSelector } from 'react-redux'

/**
 * Event Handler component for handling various events in the editor
 * @param {object} pubSub - PubSub object
 * @param {object} tab - The current editor's tab object
 * @returns - null, this is a functional component used for managing side effects
 */
const EventHandler = ({ pubSub, tab }) => {
  const config = useConfig()

  // only using this to handle events, so not rendering anything with it.
  const { createOrFocus, windowTypes } = useLayout()
  const { enqueueSnackbar } = useSnackbar()

  const { currentAgentId } = useSelector(
    (state: RootState) => state.globalConfig
  )

  const [saveSpellMutation] = useSaveSpellMutation()
  // TODO: is this a bug?
  const [getSpell, { data: spell }] = useLazyGetSpellByIdQuery({
    spellName: tab.name.split('--')[0],
    id: tab.id,
    projectId: config.projectId,
  } as any)
  // Spell ref because callbacks can't hold values from state without them
  const spellRef = useRef<SpellInterface | null>(null)

  const FeathersContext = useFeathers()
  const client = FeathersContext.client

  useEffect(() => {
    getSpell({
      spellName: tab.name,
      id: tab.id,
      projectId: config.projectId,
    })
  }, [config.projectId, getSpell, tab.id, tab.name])

  useEffect(() => {
    if (!spell) return
    const oldSpell = JSON.stringify(spellRef.current)
    const newSpell = JSON.stringify(spell?.data[0])
    if (oldSpell === newSpell) return

    spellRef.current = spell?.data[0]
  }, [spell])

  useEffect(() => {
    if (!client.io || !tab.id || !enqueueSnackbar) return

    const listener = data => {
      // publish($DEBUG_PRINT(tab.id), (data.error.message))
      console.error('Error in spell execution')
      enqueueSnackbar('Error Running the spell. Please Check the Console', {
        variant: 'error',
      })
    }

    client.io.on(`${tab.id}-error`, listener)

    // Handle cleaning up the subscription
    return () => {
      client.io.off(`${tab.id}-error`, listener)
    }
  }, [client.io, tab.id, enqueueSnackbar])

  const {
    serialize,
    getEditor,
    undo,
    redo,
    del,
    multiSelectCopy,
    multiSelectPaste,
  } = useEditor()

  const { events, subscribe } = pubSub

  const {
    $DELETE,
    $UNDO,
    $REDO,
    $MULTI_SELECT_COPY,
    $MULTI_SELECT_PASTE,
    $SAVE_SPELL,
    $SAVE_SPELL_DIFF,
    $CREATE_MESSAGE_REACTION_EDITOR,
    $CREATE_PLAYTEST,
    $CREATE_INSPECTOR,
    $CREATE_CONSOLE,
    $CREATE_TEXT_EDITOR,
    $CREATE_AGENT_CONTROLS,
    $EXPORT,
    $CLOSE_EDITOR,
    $PROCESS,
    $RUN_SPELL,
    $RESET_HIGHLIGHTS,
  } = events

  /**
   * Save the current spell
   */
  const saveSpell = async () => {
    const currentSpell = spellRef.current
    const graph = serialize() as GraphData
    if (!currentSpell) return

    const updatedSpell = {
      ...currentSpell,
      graph,
      hash: md5(JSON.stringify(graph)),
    }

    const response = await saveSpellMutation({
      spell: updatedSpell,
      projectId: config.projectId,
    })

    if ('error' in response) {
      console.error(response.error)
      enqueueSnackbar('Error saving spell', {
        variant: 'error',
      })
      return
    }

    enqueueSnackbar('Spell saved', {
      variant: 'success',
    })

    // onProcess()
  }

  /**
   * Save an incremental diff of changes made in editor to the server
   * @param {object} event - The onSaveDiff event object
   * @param {object} update - The updated spell object
   */
  const onSaveDiff = async (event, update) => {
    if (!spellRef.current) return

    const currentSpell = spellRef.current
    const updatedSpell = {
      ...currentSpell,
      ...update,
    }

    const jsonDiff = diff(currentSpell, updatedSpell)

    // no point saving if nothing has changed
    if (jsonDiff.length === 0) {
      console.warn('No changes to save')
      return
    }
    // While Importing spell, the graph is first created, then the imported graph is loaded
    // This might be causing issue at the server end.import { GlobalConfig } from '../../../../dist/packages/editor/state/globalConfig.d';

    if (updatedSpell.graph.nodes.length === 0) return

    updatedSpell.hash = md5(JSON.stringify(updatedSpell.graph.nodes))

    try {
      // We save the diff. Doing this via feathers but may want to switch to rtk query
      const diffResponse = await client.service('spells').saveDiff({
        projectId: config.projectId,
        diff: jsonDiff,
        name: currentSpell.name,
        id: currentSpell.id,
      })

      spellRef.current = diffResponse

      if ('error' in diffResponse) {
        enqueueSnackbar('Error Updating spell', {
          variant: 'error',
        })
        return
      }
    } catch (err) {
      enqueueSnackbar('Error saving spell', {
        variant: 'error',
      })
      return
    }
  }

  const createMessageReactionEditor = () => {
    createOrFocus(
      windowTypes.MESSAGE_REACTION_EDITOR,
      'Message Reaction Editor'
    )
  }

  /**
   * Create a new playtest window or focus on the existing one
   */
  const createPlaytest = () => {
    createOrFocus(windowTypes.PLAYTEST, 'Playtest')
  }

  /**
   * Create a new agent controls window or focus on the existing one
   */
  const createAgentControls = () => {
    createOrFocus(windowTypes.AGENT_CONTROLS, 'Agent Controls')
  }

  /**
   * Create a new inspector window or focus on the existing one
   */
  const createInspector = () => {
    createOrFocus(windowTypes.INSPECTOR, 'Inspector')
  }

  /**
   * Create a new text editor window or focus on the existing one
   */
  const createTextEditor = () => {
    createOrFocus(windowTypes.TEXT_EDITOR, 'Text Editor')
  }

  /**
   * Create a new console window or focus on the existing one
   */
  const createConsole = () => {
    createOrFocus(windowTypes.CONSOLE, 'Console')
  }

  /**
   * Trigger the processing of the graph in the editor
   */
  const onProcess = () => {
    const editor = getEditor()
    if (!editor) return
  }

  /**
   * Trigger the undo action in the editor
   */
  const onUndo = () => {
    undo()
  }

  /**
   * Trigger the redo action in the editor
   */
  const onRedo = () => {
    redo()
  }

  /**
   * Trigger the delete action in the editor
   */
  const onDelete = () => {
    del()
  }

  /**
   * Trigger the multi-select copy action in the editor
   */
  const onMultiSelectCopy = () => {
    multiSelectCopy()
  }

  /**
   * Trigger the multi-select paste action in the editor
   */
  const onMultiSelectPaste = () => {
    multiSelectPaste()
  }

  /**
   * Export the current spell to a JSON file
   */
  const onExport = async () => {
    // refetch spell from local DB to ensure it is the most up to date
    const spell = { ...spellRef.current }
    spell.graph = serialize() as GraphData

    // remove secrets, if there are any
    function recurse(obj) {
      for (const key in obj) {
        if (key === 'secrets') {
          obj[key] = {}
        }
        if (typeof obj[key] === 'object') {
          recurse(obj[key])
        }
      }
    }

    recurse(spell)

    // traverse the json. replace any
    const json = JSON.stringify(spell, null, 4)

    const blob = new Blob([json], { type: 'application/json' })
    const url = window.URL.createObjectURL(new Blob([blob]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${spell.name}.spell.json`)

    // Append to html link element page
    document.body.appendChild(link)

    // Start download
    link.click()

    if (!link.parentNode) return

    // Clean up and remove the link
    link.parentNode.removeChild(link)
  }

  // clean up anything inside the editor which we need to shut down.
  // mainly subscriptions, etc.
  const onCloseEditor = () => {
    const editor = getEditor() as Record<string, any>
    if (editor.moduleSubscription) editor.moduleSubscription.unsubscribe()
  }

  /**
   * Run the current spell
   * @param {object} event - The run Spell event object
   * @param {object} data - The data object for running the spell
   */
  const runSpell = async (event, _data) => {
    // run the spell in the spell runner service
    const data = {
      spellId: spellRef.current.id,
      agentId: currentAgentId,
      projectId: config.projectId,
      isPlaytest: true,
      ..._data,
    }
    const response = await client.service('agents').run(data)
  }

  const resetHighlights = () => {
    const editor = getEditor() as Record<string, any>
    editor.resetHighlights()
  }

  const handlerMap = {
    [$SAVE_SPELL(tab.id)]: saveSpell,
    [$CREATE_MESSAGE_REACTION_EDITOR(tab.id)]: createMessageReactionEditor,
    [$CREATE_PLAYTEST(tab.id)]: createPlaytest,
    [$CREATE_INSPECTOR(tab.id)]: createInspector,
    [$CREATE_TEXT_EDITOR(tab.id)]: createTextEditor,
    [$CREATE_AGENT_CONTROLS(tab.id)]: createAgentControls,
    [$CREATE_CONSOLE(tab.id)]: createConsole,
    [$EXPORT(tab.id)]: onExport,
    [$CLOSE_EDITOR(tab.id)]: onCloseEditor,
    [$UNDO(tab.id)]: onUndo,
    [$REDO(tab.id)]: onRedo,
    [$DELETE(tab.id)]: onDelete,
    [$MULTI_SELECT_COPY(tab.id)]: onMultiSelectCopy,
    [$MULTI_SELECT_PASTE(tab.id)]: onMultiSelectPaste,
    [$PROCESS(tab.id)]: onProcess,
    [$SAVE_SPELL_DIFF(tab.id)]: onSaveDiff,
    [$RUN_SPELL(tab.id)]: runSpell,
    [$RESET_HIGHLIGHTS(tab.id)]: resetHighlights,
  }

  useEffect(() => {
    if (!tab && !spell && !client) return

    const subscriptions = Object.entries(handlerMap).map(([event, handler]) => {
      return subscribe(event, handler)
    })

    // unsubscribe from all subscriptions on unmount
    return () => {
      subscriptions.forEach(unsubscribe => {
        unsubscribe()
      })
    }
  }, [tab, client, spell, handlerMap, subscribe])

  return null
}

export default EventHandler
