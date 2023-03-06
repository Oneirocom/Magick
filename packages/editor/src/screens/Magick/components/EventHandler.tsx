import { useEffect, useRef } from 'react'
import { useSnackbar } from 'notistack'
import { GraphData, Spell } from '@magickml/engine'

import md5 from 'md5'

import { getSpellApi } from '../../../state/api/spells'
import { useLayout } from '../../../workspaces/contexts/LayoutProvider'
import { useEditor } from '../../../workspaces/contexts/EditorProvider'
import { diff } from '../../../utils/json0'
import { useFeathers } from '../../../contexts/FeathersProvider'

import { useConfig } from '../../../contexts/ConfigProvider'

const EventHandler = ({ pubSub, tab }) => {
  const config = useConfig()
  const spellApi = getSpellApi(config)

  // only using this to handle events, so not rendering anything with it.
  const { createOrFocus, windowTypes } = useLayout()
  const { enqueueSnackbar } = useSnackbar()

  const [saveSpellMutation] = spellApi.useSaveSpellMutation()
  const [getSpell, { data: spell, isLoading }] =
    spellApi.useLazyGetSpellByIdQuery({
      spellName: tab.name.split('--')[0],
      id: tab.id,
      projectId: config.projectId,
    })
  // Spell ref because callbacks cant hold values from state without them
  const spellRef = useRef<Spell | null>(null)

  const FeathersContext = useFeathers()
  const client = FeathersContext.client

  useEffect(() => {
    //if (!spell || !spell?.data[0]) return
    getSpell({
      spellName: tab.name,
      id: tab.id,
      projectId: config.projectId,
    })
    spellRef.current = spell?.data[0]
  }, [spell])

  // this may be better suited somewhere else.  Was moved from playtest window
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

  const { serialize, getEditor, undo, redo, del } = useEditor()

  const { events, subscribe, publish } = pubSub

  const {
    $DELETE,
    $UNDO,
    $REDO,
    $SAVE_SPELL,
    $SAVE_SPELL_DIFF,
    $CREATE_AVATAR_WINDOW,
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

    const jsonDiff = diff(currentSpell, updatedSpell)

    if (jsonDiff.length !== 0) {
      // save diff to spell runner if something has changed.  Will update spell in spell runner session
      client.service('spell-runner').update(currentSpell.id, {
        diff: jsonDiff,
        projectId: config.projectId,
      })
    }

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
  }

  const onSaveDiff = async (event, update) => {
    if (!spellRef.current) return

    const currentSpell = spellRef.current
    const updatedSpell = {
      ...currentSpell,
      ...update,
    }

    const jsonDiff = diff(currentSpell, updatedSpell)

    updatedSpell.hash = md5(JSON.stringify(updatedSpell.graph.nodes))

    // no point saving if nothing has changed
    if (jsonDiff.length === 0) return
    //While Importing spell, the graph is first created, then the imported graph is loaded
    //This might be causing issue at the server end.
    if (updatedSpell.graph.nodes.length === 0) return

    try {
      await client.service('spell-runner').update(currentSpell.id, {
        diff: jsonDiff,
        projectId: config.projectId,
      })
      const diffResponse = await client.service('spells').saveDiff({
        projectId: config.projectId,
        diff: jsonDiff,
        name: currentSpell.name,
      })
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

  const onExport = async () => {
    // refetch spell from local DB to ensure it is the most up to date
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

  const runSpell = async (event, data) => {
    console.log('DATA IN EVENT HANDLER', data)

    // We are publishing the diff just to ensure that the spell runner has the latest version of the spell
    // publish($SAVE_SPELL_DIFF(tab.id), { graph: serialize() })

    // wait .2. seconds for spell_diff to take effect
    await new Promise(resolve => setTimeout(resolve, 200))

    // run the spell in the spell runner service
    client.service('spell-runner').create(data)
  }

  const handlerMap = {
    [$SAVE_SPELL(tab.id)]: saveSpell,
    [$CREATE_MESSAGE_REACTION_EDITOR(tab.id)]: createMessageReactionEditor,
    [$CREATE_AVATAR_WINDOW(tab.id)]: createAvatarWindow,
    [$CREATE_PLAYTEST(tab.id)]: createPlaytest,
    [$CREATE_INSPECTOR(tab.id)]: createInspector,
    [$CREATE_TEXT_EDITOR(tab.id)]: createTextEditor,
    [$CREATE_CONSOLE(tab.id)]: createConsole,
    [$EXPORT(tab.id)]: onExport,
    [$CLOSE_EDITOR(tab.id)]: onCloseEditor,
    [$UNDO(tab.id)]: onUndo,
    [$REDO(tab.id)]: onRedo,
    [$DELETE(tab.id)]: onDelete,
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
  }, [tab, client])

  return null
}

export default EventHandler
