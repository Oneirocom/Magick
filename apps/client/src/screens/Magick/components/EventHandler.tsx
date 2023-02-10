import { useEffect, useRef } from 'react'
import { useSnackbar } from 'notistack'
import { useSelector } from 'react-redux'
import { GraphData, Spell } from '@magickml/engine'

import md5 from 'md5'

import {
  useSaveSpellMutation,
  useGetSpellQuery,
  useSaveDiffMutation,
} from '../../../state/api/spells'
import { useLayout } from '../../../workspaces/contexts/LayoutProvider'
import { useEditor } from '../../../workspaces/contexts/EditorProvider'
import { diff } from '../../../utils/json0'
import { useFeathers } from '../../../contexts/FeathersProvider'
import { RootState } from '../../../state/store'

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
  const client = FeathersContext.client
  useEffect(() => {
    if (!spell || !spell?.data[0]) return
    spellRef.current = spell.data[0]
  }, [spell])

  const { serialize, getEditor, undo, redo, del } = useEditor()

  const { events, subscribe } = pubSub

  const {
    $DELETE,
    $UNDO,
    $REDO,
    $SAVE_SPELL,
    $SAVE_SPELL_DIFF,
    $CREATE_SEARCH_CORPUS,
    $CREATE_AVATAR_WINDOW,
    $CREATE_MESSAGE_REACTION_EDITOR,
    $CREATE_PLAYTEST,
    $CREATE_INSPECTOR,
    $CREATE_CONSOLE,
    $CREATE_TEXT_EDITOR,
    $SERIALIZE,
    $EXPORT,
    $CLOSE_EDITOR,
    $PROCESS,
  } = events

  const saveSpell = async () => {
    const currentSpell = spellRef.current
    const graph = serialize() as GraphData

    if (!currentSpell) return

    console.log('currentSpell', currentSpell)
    console.log('graph', graph)

    const updatedSpell = {
      ...currentSpell,
      graph,
      hash: md5(JSON.stringify(graph))
    }

    console.log('updatedSpell', updatedSpell)

    const response = await saveSpellMutation(updatedSpell)
    const jsonDiff = diff(currentSpell, updatedSpell)

    if (jsonDiff.length !== 0) {
      console.log('Sending json diff to spell runner!')
      // save diff to spell runner if something has changed.  Will update spell in spell runner session
      await client.service('spell-runner').update(currentSpell.name, {
        diff: jsonDiff,
      })
    }

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
    updatedSpell.hash = md5(JSON.stringify(updatedSpell.graph.nodes));

    const jsonDiff = diff(currentSpell, updatedSpell)

    // no point saving if nothing has changed
    if (jsonDiff.length === 0) return

    try {
      await client.service('spell-runner').update(currentSpell.name, {
        diff: jsonDiff,
      })
      await saveDiff({
        name: currentSpell.name,
        diff: jsonDiff,
      })
      enqueueSnackbar('Spell saved', {
        variant: 'success',
      })
    } catch {
      enqueueSnackbar('Error saving spell', {
        variant: 'error',
      })
      return
    }
  }

  const createSearchCorpus = () => {
    createOrFocus(windowTypes.SEARCH_CORPUS, 'Search Corpus')
  }

  const createAvatarWindow = () => {
    createOrFocus(windowTypes.AVATAR, 'Avatar Window')
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

  const onSerialize = () => {
    // eslint-disable-next-line no-console
    console.log(serialize())
  }

  const onProcess = () => {
    const editor = getEditor()
    if (!editor) return

    console.log('RUNNING PROCESS')

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
    [$CREATE_SEARCH_CORPUS(tab.id)]: createSearchCorpus,
    [$CREATE_MESSAGE_REACTION_EDITOR(tab.id)]: createMessageReactionEditor,
    [$CREATE_AVATAR_WINDOW(tab.id)]: createAvatarWindow,
    [$CREATE_PLAYTEST(tab.id)]: createPlaytest,
    [$CREATE_INSPECTOR(tab.id)]: createInspector,
    [$CREATE_TEXT_EDITOR(tab.id)]: createTextEditor,
    [$CREATE_CONSOLE(tab.id)]: createConsole,
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
