import { useEffect, useRef } from 'react'
import { useSnackbar } from 'notistack'
import { SpellInterface } from '@magickml/core'

import {
  useLazyGetSpellByIdQuery
} from '../../../state/api/spells'

import { useConfig, useFeathers } from '@magickml/client-core'

const EventHandler = ({ pubSub, conversation }) => {
  const config = useConfig()

  // only using this to handle events, so not rendering anything with it.
  const { enqueueSnackbar } = useSnackbar()

  const [getSpell, { data: spell }] = useLazyGetSpellByIdQuery({
    // not sure why but typing for this is broken so using ts-ignore for now
    // @ts-ignore
    spellName: conversation.name.split('--')[0],
    id: conversation.id,
    projectId: config.projectId,
  })
  // Spell ref because callbacks cant hold values from state without them
  const spellRef = useRef<SpellInterface | null>(null)

  const FeathersContext = useFeathers()
  const client = FeathersContext.client

  useEffect(() => {
    getSpell({
      spellName: conversation.name,
      id: conversation.id,
      projectId: config.projectId,
    })
    spellRef.current = spell?.data[0]
  }, [config.projectId, getSpell, spell, conversation.id, conversation.name])

  useEffect(() => {
    if (!client.io || !conversation.id || !enqueueSnackbar) return

    const listener = data => {
      //publish($DEBUG_PRINT(conversation.id), (data.error.message))
      console.error('Error in spell execution')
      enqueueSnackbar('Error Running the spell. Please Check the Console', {
        variant: 'error',
      })
    }

    client.io.on(`${conversation.id}-error`, listener)

    // Handle cleaning up the subscription
    return () => {
      client.io.off(`${conversation.id}-error`, listener)
    }
  }, [client.io, conversation.id, enqueueSnackbar])
  const { events, subscribe } = pubSub

  const {
    $RUN_SPELL,
  } = events

  const runSpell = async (event, data) => {
    console.log("🚀 ~ file: EventHandler.tsx:65 ~ runSpell ~ data:", data)
    // run the spell in the spell runner service
    client.service('spell-runner').create(data)
  }

  const handlerMap = {
    [$RUN_SPELL(conversation.id)]: runSpell,
  }

  useEffect(() => {
    if (!conversation && !spell && !client) return

    const subscriptions = Object.entries(handlerMap).map(([event, handler]) => {
      return subscribe(event, handler)
    })

    // unsubscribe from all subscriptions on unmount
    return () => {
      subscriptions.forEach(unsubscribe => {
        unsubscribe()
      })
    }
  }, [conversation, client, spell, handlerMap, subscribe])

  return null
}

export default EventHandler
