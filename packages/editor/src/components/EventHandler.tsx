import { useEffect, useRef } from 'react'
import { useSnackbar } from 'notistack'
import { GraphData, SpellInterface } from '@magickml/engine'

import md5 from 'md5'

import {
  useLazyGetSpellByIdQuery,
  useSaveSpellMutation,
} from '../state/api/spells'
import { useLayout } from '../contexts/LayoutProvider'
import { useEditor } from '../contexts/EditorProvider'
import { diff } from '../utils/json0'
import { useFeathers } from '../contexts/FeathersProvider'

import { useConfig } from '../contexts/ConfigProvider'

const EventHandler = ({ pubSub, tab }) => {
  const config = useConfig()

  // only using this to handle events, so not rendering anything with it.
  const { createOrFocus, windowTypes } = useLayout()
  const { enqueueSnackbar } = useSnackbar()

  const [saveSpellMutation] = useSaveSpellMutation()
  // TODO: is this a bug?
  const [getSpell, { data: spell }] = useLazyGetSpellByIdQuery({
    spellName: tab.name.split('--')[0],
    id: tab.id,
    projectId: config.projectId,
  } as any)
  // Spell ref because callbacks cant hold values from state without them
  const spellRef = useRef<SpellInterface | null>(null)

  const FeathersContext = useFeathers()
  const client = FeathersContext.client

  useEffect(() => {
    getSpell({
      spellName: tab.name,
      id: tab.id,
      projectId: config.projectId,
    })
    spellRef.current = spell?.data[0]
  }, [config.projectId, getSpell, spell, tab.id, tab.name])

  useEffect(() => {
    if (!client.io || !tab.id || !enqueueSnackbar) return

    const listener = data => {
      //publish($DEBUG_PRINT(tab.id), (data.error.message))
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
    $CREATE_PROJECT_WINDOW,
    $CREATE_MESSAGE_REACTION_EDITOR,
    $CREATE_PLAYTEST,
    $CREATE_INSPECTOR,
    $CREATE_CONSOLE,
    $CREATE_TEXT_EDITOR,
    $EXPORT,
    $CLOSE_EDITOR,
    $PROCESS,
    $RUN_SPELL,
  } = events

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
      console.log('UPDATED SPELL', updatedSpell)
      console.error(response.error)
      enqueueSnackbar('Error saving spell', {
        variant: 'error',
      })
      return
    }

    enqueueSnackbar('Spell saved', {
      variant: 'success',
    })

    onProcess()
  }

  const onSaveDiff = async (event, update) => {
    if (!spellRef.current) return

    const currentSpell = spellRef.current
    const updatedSpell = {
      ...currentSpell,
      ...update,
    }

    const jsonDiff = diff(currentSpell, updatedSpell)

    // no point saving if nothing has changed
    if (jsonDiff.length === 0) return
    //While Importing spell, the graph is first created, then the imported graph is loaded
    //This might be causing issue at the server end.
    if (updatedSpell.graph.nodes.length === 0) return

    updatedSpell.hash = md5(JSON.stringify(updatedSpell.graph.nodes))

    try {
      // We save the diff.  Doing this via feathers but may want to switch to rtk query
      const diffResponse = await client.service('spells').saveDiff({
        projectId: config.projectId,
        diff: jsonDiff,
        name: currentSpell.name,
        id: currentSpell.id,
      })

      // refresh the spell after saving
      getSpell({
        spellName: tab.name,
        id: tab.id,
        projectId: config.projectId,
      })

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

    onProcess()
  }

  const createProjectWindow = () => {
    createOrFocus(windowTypes.PROJECT, 'Project Window')
  }

  const createMessageReactionEditor = () => {
    createOrFocus(
      windowTypes.MESSAGE_REACTION_EDITOR,
      'Message Reaction Editor'
    )
  }

  const createPlaytest = () => {
    createOrFocus(windowTypes.PLAYTEST, 'Playtest')
  }

  const createInspector = () => {
    createOrFocus(windowTypes.INSPECTOR, 'Inspector')
  }

  const createTextEditor = () => {
    createOrFocus(windowTypes.TEXT_EDITOR, 'Text Editor')
  }

  const createConsole = () => {
    createOrFocus(windowTypes.CONSOLE, 'Console')
  }

  const onProcess = () => {
    const editor = getEditor()
    if (!editor) return

    editor.runProcess()
  }

  const onUndo = () => {
    undo()
  }

  const onRedo = () => {
    redo()
  }

  const onDelete = () => {
    del()
  }

  const onMultiSelectCopy = () => {
    multiSelectCopy()
  }

  const onMultiSelectPaste = () => {
    multiSelectPaste()
  }

  const onExport = async () => {
    // refetch spell from local DB to ensure it is the most up to date
    const spell = { ...spellRef.current }
    spell.graph = serialize() as GraphData

    // remove secrets, if there are any
    function recurse(obj) {
      for (const key in obj) {
        if (key === 'secrets') {
          obj[key] = {}
          console.log('removed secrets')
        }
        if (typeof obj[key] === 'object') {
          recurse(obj[key])
        }
      }
    }

    recurse(spell)

    // traverse the json. replace any
    const json = JSON.stringify(spell)

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

  const runSpell = async (event, data) => {
    // run the spell in the spell runner service
    client.service('spell-runner').create(data)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handlerMap = {
    [$SAVE_SPELL(tab.id)]: saveSpell,
    [$CREATE_MESSAGE_REACTION_EDITOR(tab.id)]: createMessageReactionEditor,
    [$CREATE_PROJECT_WINDOW(tab.id)]: createProjectWindow,
    [$CREATE_PLAYTEST(tab.id)]: createPlaytest,
    [$CREATE_INSPECTOR(tab.id)]: createInspector,
    [$CREATE_TEXT_EDITOR(tab.id)]: createTextEditor,
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
