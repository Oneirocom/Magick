import { useEffect, useRef } from 'react'
import { useSnackbar } from 'notistack'
import { Spell } from '@magickml/engine'

import {
  useLazyGetSpellByIdQuery
} from '../../../state/api/spells'
import { useLayout } from '../../../chatwindow/contexts/LayoutProvider'
import { useEditor } from '../../../chatwindow/contexts/EditorProvider'
import { useFeathers } from '../../../contexts/FeathersProvider'

import { useConfig } from '../../../contexts/ConfigProvider'

const EventHandler = ({ pubSub, tab }) => {
  const config = useConfig()

  // only using this to handle events, so not rendering anything with it.
  const { createOrFocus, windowTypes } = useLayout()
  const { enqueueSnackbar } = useSnackbar()

  const [getSpell, { data: spell }] = useLazyGetSpellByIdQuery({
    spellName: tab.name.split('--')[0],
    id: tab.id,
    projectId: config.projectId,
  })
  // Spell ref because callbacks cant hold values from state without them
  const spellRef = useRef<Spell | null>(null)

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
    getEditor,
  } = useEditor()

  const { events, subscribe } = pubSub

  const {
    $CREATE_CHAT_WINDOW,
    $CLOSE_EDITOR,
    $PROCESS,
    $RUN_SPELL,
  } = events

  const createChatWindow = () => {
    createOrFocus(windowTypes.CHAT, 'Chat')
  }

  const onProcess = () => {
    const editor = getEditor()
    if (!editor) return

    editor.runProcess()
  }

  // clean up anything inside the editor which we need to shut down.
  // mainly subscriptions, etc.
  const onCloseEditor = () => {
    const editor = getEditor() as Record<string, any>
    if (editor.moduleSubscription) editor.moduleSubscription.unsubscribe()
  }

  const runSpell = async (event, data) => {
    console.log('DATA IN EVENT HANDLER', data)

    // run the spell in the spell runner service
    client.service('spell-runner').create(data)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handlerMap = {
    [$CREATE_CHAT_WINDOW(tab.id)]: createChatWindow,
    [$CLOSE_EDITOR(tab.id)]: onCloseEditor,
    [$PROCESS(tab.id)]: onProcess,
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
