// DOCUMENTED
import { useCallback, useEffect, useRef } from 'react'
import { useSnackbar } from 'notistack'

import { Tab, useConfig, useFeathers } from '@magickml/providers'
import {
  useLazyGetSpellQuery,
  useSaveSpellMutation,
  setSyncing,
} from 'client/state'
import { useDispatch } from 'react-redux'
import { SpellInterface } from 'server/schemas'
import posthog from 'posthog-js'

type Props = {
  pubSub: any
  tab: Tab
  spellId: string
}

/**
 * Event Handler component for handling various events in the editor
 * @param {object} pubSub - PubSub object
 * @param {object} tab - The current editor's tab object
 * @returns - null, this is a functional component used for managing side effects
 */
const EventHandler = ({ pubSub, tab, spellId }: Props) => {
  const dispatch = useDispatch()
  const config = useConfig()

  // only using this to handle events, so not rendering anything with it.
  const { enqueueSnackbar } = useSnackbar()

  const [saveSpellMutation] = useSaveSpellMutation()
  // TODO: is this a bug?
  const [getSpell, { data: spell }] = useLazyGetSpellQuery({
    id: spellId,
  } as any)
  // Spell ref because callbacks can't hold values from state without them
  const spellRef = useRef<SpellInterface | null>(null)

  const FeathersContext = useFeathers()
  const client = FeathersContext.client

  useEffect(() => {
    getSpell({ id: spellId })
  }, [config.projectId, getSpell, spellId, tab.name])

  useEffect(() => {
    if (!spell) return
    const oldSpell = JSON.stringify(spellRef.current)
    const newSpell = JSON.stringify(spell)
    if (oldSpell === newSpell) return

    spellRef.current = spell
  }, [spell])

  const { events, subscribe, publish } = pubSub

  const { $DELETE, $SAVE_SPELL, $SAVE_SPELL_DIFF, $EXPORT, $SUBSPELL_UPDATED } =
    events

  /**
   * Save the current spell
   */
  const saveSpell = useCallback(
    async (event: string, update = {}) => {
      if (!spellRef.current) return
      const type = spellRef.current.type || 'spell'

      const currentSpell = spellRef.current

      const graph = currentSpell.graph
      if (!currentSpell) return

      const updatedSpell = {
        ...currentSpell,
        graph,
        ...update,
      }

      if (!updatedSpell.type) updatedSpell.type = type

      dispatch(setSyncing(true))

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

      setTimeout(() => {
        dispatch(setSyncing(false))
        posthog.capture('spell_updated', {
          spellId: currentSpell.id,
          projectId: config.projectId,
        })
        return
      }, 1000)

      enqueueSnackbar('Spell saved', {
        variant: 'success',
      })

      // onProcess()
    },
    [spellRef, saveSpellMutation, config.projectId, enqueueSnackbar]
  )

  /**
   * Save an incremental diff of changes made in editor to the server
   * @param {object} event - The onSaveDiff event object
   * @param {object} update - The updated spell object
   */
  const onSaveDiff = useCallback(
    async (
      event: unknown,
      update: Partial<SpellInterface>,
      onSuccessCB: () => void
    ) => {
      if (!spellRef.current) return true

      const currentSpell = spellRef.current
      const updatedSpell = {
        ...currentSpell,
        ...update,
      }

      if (currentSpell.spellReleaseId) return

      try {
        dispatch(setSyncing(true))
        // We save the diff. Doing this via feathers but may want to switch to rtk query
        const response = await client.service('spells').patch(currentSpell.id, {
          ...updatedSpell,
          projectId: config.projectId,
        })
        // dispatch(applyState({ value: currentSpell, clearFuture: !isDirty }))

        spellRef.current = response

        publish($SUBSPELL_UPDATED(response.id), updatedSpell)
        onSuccessCB && onSuccessCB()
        // extend the timeout to 500ms to give the user a chance to see the sync icon
        setTimeout(() => {
          dispatch(setSyncing(false))
          posthog.capture('spell_updated', {
            spellId: currentSpell.id,
            projectId: config.projectId,
          })
          return
        }, 1000)

        if ('error' in response) {
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
    },
    [dispatch, client, config.projectId, enqueueSnackbar, spellRef]
  )

  /**
   * Trigger the delete action in the editor
   */
  const onDelete = useCallback(() => {
    console.warn('delete not implemented yet')
  }, [])

  /**
   * Export the current spell to a JSON file
   */
  const onExport = useCallback(async () => {
    // refetch spell from local DB to ensure it is the most up to date
    const spell = { ...spellRef.current }

    // remove secrets, if there are any
    function recurse(obj: { [x: string]: any }) {
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

    posthog.capture('spell_exported', {
      spellId: spell.id,
      projectId: config.projectId,
    })

    if (!link.parentNode) return

    // Clean up and remove the link
    link.parentNode.removeChild(link)
  }, [spellRef])

  const handlerMap = {
    [$SAVE_SPELL(tab.id)]: saveSpell,
    [$EXPORT(tab.id)]: onExport,
    [$DELETE(tab.id)]: onDelete,
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
  }, [tab, client, spell, handlerMap, subscribe])

  return null
}

export default EventHandler
