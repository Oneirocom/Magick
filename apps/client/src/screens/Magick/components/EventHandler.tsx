import { useEffect, useRef } from 'react'
import { GraphData, Spell } from '@magickml/core'

import {
  useSaveSpellMutation,
  useGetSpellQuery,
  useSaveDiffMutation,
} from '../../../state/api/spells'
import { useLayout } from '../../../workspaces/contexts/LayoutProvider'
import { useEditor } from '../../../workspaces/contexts/EditorProvider'
import { diff } from '../../../utils/json0'
import { useSnackbar } from 'notistack'
import { useFeathers } from '../../../contexts/FeathersProvider'
import { RootState } from '../../../state/store'
import { useSelector } from 'react-redux'

const EventHandler = ({ pubSub, tab }) => {
  // only using this to handle events, so not rendering anything with it.
  const { createOrFocus, windowTypes } = useLayout()
  const { enqueueSnackbar } = useSnackbar()

  const [saveSpellMutation] = useSaveSpellMutation()
  const [saveDiff] = useSaveDiffMutation()
  const { data: spell } = useGetSpellQuery({
    spellId: tab.spellId,
  })
  const preferences = useSelector(
    (state: RootState) => state.preferences
  ) as any

  // Spell ref because callbacks cant hold values from state without them
  const spellRef = useRef<Spell | null>(null)

  const FeathersContext = useFeathers()
  const client = FeathersContext?.client
  useEffect(() => {
    if (!spell) return
    spellRef.current = spell
  }, [spell])

  const {
    serialize,
    getEditor,
    undo,
    redo,
    del,
    getDirtyGraph,
    setDirtyGraph,
  } = useEditor()

  const { events, subscribe } = pubSub

  const {
    $DELETE,
    $UNDO,
    $REDO,
    $SAVE_SPELL,
    $SAVE_SPELL_DIFF,
    $CREATE_STATE_MANAGER,
    $CREATE_SEARCH_CORPUS,
    $CREATE_ENT_MANAGER,
    $CREATE_SETTINGS_WINDOW,
    $CREATE_MESSAGE_REACTION_EDITOR,
    $CREATE_PLAYTEST,
    $CREATE_INSPECTOR,
    $CREATE_CONSOLE,
    $CREATE_EVENT_MANAGER,
    $CREATE_TEXT_EDITOR,
    $SERIALIZE,
    $EXPORT,
    $CLOSE_EDITOR,
    $PROCESS,
  } = events

  const saveSpell = async () => {
    const currentSpell = spellRef.current
    const graph = serialize() as GraphData

    const response = await saveSpellMutation({
      ...currentSpell,
      graph,
    })

    if ('error' in response) {
      enqueueSnackbar('Error saving spell', {
        variant: 'error',
      })
      return
    }

    if (preferences.autoSave) {
      enqueueSnackbar('Spell saved', {
        variant: 'success',
      })
    }
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

    const response = await saveDiff({
      name: currentSpell.name,
      diff: jsonDiff,
    })

    setDirtyGraph(true)

    // if (preferences.autoSave) {
    //   if ('error' in response) {
    //     enqueueSnackbar('Error saving spell', {
    //       variant: 'error',
    //     })
    //     return
    //   }

    //   enqueueSnackbar('Spell saved', {
    //     variant: 'success',
    //   })
    // }

    // if (feathersFlag) {
    //   try {
    //     await client.service('spell-runner').update(currentSpell.name, {
    //       diff: jsonDiff,
    //     })
    //     enqueueSnackbar('Spell saved', {
    //       variant: 'success',
    //     })
    //   } catch {
    //     enqueueSnackbar('Error saving spell', {
    //       variant: 'error',
    //     })
    //     return
    //   }
    // }
  }

  const createStateManager = () => {
    createOrFocus(windowTypes.STATE_MANAGER, 'State Manager')
  }

  const createSearchCorpus = () => {
    createOrFocus(windowTypes.SEARCH_CORPUS, 'Search Corpus')
  }

  const createEntityManager = () => {
    createOrFocus(windowTypes.ENT_MANAGER, 'Agent Manager')
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

  const createEventManager = () => {
    createOrFocus(windowTypes.EVENT_MANAGER, 'Event Manager')
  }

  const onSerialize = () => {
    // eslint-disable-next-line no-console
    console.log(serialize())
  }

  const onProcess = () => {
    const editor = getEditor()
    if (!editor || !getDirtyGraph()) return

    console.log('RUNNING PROCESS')

    editor.runProcess(() => {
      setDirtyGraph(false)
    })
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

  const onExport = async () => {
    // refetch spell from local DB to ensure it is the most up to date
    console.log('ON EXPORT')
    const spell = { ...spellRef.current }
    spell.graph = serialize() as GraphData

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

  const handlerMap = {
    [$SAVE_SPELL(tab.id)]: saveSpell,
    [$CREATE_STATE_MANAGER(tab.id)]: createStateManager,
    [$CREATE_SEARCH_CORPUS(tab.id)]: createSearchCorpus,
    [$CREATE_MESSAGE_REACTION_EDITOR(tab.id)]: createMessageReactionEditor,
    [$CREATE_ENT_MANAGER(tab.id)]: createEntityManager,
    [$CREATE_PLAYTEST(tab.id)]: createPlaytest,
    [$CREATE_INSPECTOR(tab.id)]: createInspector,
    [$CREATE_TEXT_EDITOR(tab.id)]: createTextEditor,
    [$CREATE_CONSOLE(tab.id)]: createConsole,
    [$CREATE_EVENT_MANAGER(tab.id)]: createEventManager,
    [$SERIALIZE(tab.id)]: onSerialize,
    [$EXPORT(tab.id)]: onExport,
    [$CLOSE_EDITOR(tab.id)]: onCloseEditor,
    [$UNDO(tab.id)]: onUndo,
    [$REDO(tab.id)]: onRedo,
    [$DELETE(tab.id)]: onDelete,
    [$PROCESS(tab.id)]: onProcess,
    [$SAVE_SPELL_DIFF(tab.id)]: onSaveDiff,
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
  }, [tab, client])

  return null
}

export default EventHandler
