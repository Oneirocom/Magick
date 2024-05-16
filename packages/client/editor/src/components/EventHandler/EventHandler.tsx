// DOCUMENTED
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSnackbar } from 'notistack'

import { useConfig, useFeathers } from '@magickml/providers'
import {
  useLazyGetSpellQuery,
  useSaveSpellMutation,
  setSyncing,
  selectPastState,
  selectFutureState,
} from 'client/state'
import { useDispatch, useSelector } from 'react-redux'
import { SpellInterface } from 'server/schemas'
import posthog from 'posthog-js'
import { debounce } from 'lodash'

/**
 * Event Handler component for handling various events in the editor
 * @param {object} pubSub - PubSub object
 * @param {object} tab - The current editor's tab object
 * @returns - null, this is a functional component used for managing side effects
 */
const EventHandler = ({ pubSub, tab, spellId }) => {
  const dispatch = useDispatch()
  const config = useConfig()

  // only using this to handle events, so not rendering anything with it.
  const { enqueueSnackbar } = useSnackbar()

  const [saveSpellMutation] = useSaveSpellMutation()
  const [isSaving, setIsSaving] = useState(false)
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

  const pastState = useSelector(selectPastState)
  const futureState = useSelector(selectFutureState)

  const { events, subscribe, publish } = pubSub

  const {
    $DELETE,
    $UNDO,
    $REDO,
    $RELOAD_GRAPH,
    $SAVE_SPELL,
    $SAVE_SPELL_DIFF,
    $EXPORT,
  } = events

  // useHotkeys('ctrl+z, meta+z', () => onUndo())
  // useHotkeys('ctrl+shift+z, meta+shift+z', () => onRedo())

  const addUndoState = (spellid, state) => {
    // state for each spell is an array of states we add to
    const key = `spell-state-undo-${spellid}`

    const currentState = JSON.parse(localStorage.getItem(key) || '[]')

    // ensure we keep a maximum of 50 states
    if (currentState.length >= 20) {
      currentState.shift()
    }

    try {
      localStorage.setItem(key, JSON.stringify([...currentState, state]))
    } catch (e) {
      console.error(e)
    }
  }

  const removeLastUndoState = spellid => {
    const key = `spell-state-undo-${spellid}`
    const currentState = JSON.parse(localStorage.getItem(key) || '[]')
    const removedState = currentState.pop()

    console.log('removedState', removedState)

    addRedoState(spellid, removedState)

    try {
      localStorage.setItem(key, JSON.stringify(currentState))
    } catch (e) {
      console.error(e)
      return null
    }

    return removedState
  }

  const addRedoState = (spellid, state) => {
    const key = `spell-state-redo-${spellid}`
    const currentState = JSON.parse(localStorage.getItem(key) || '[]')

    // ensure we keep a maximum of 50 states
    if (currentState.length >= 50) {
      currentState.shift()
    }

    try {
      localStorage.setItem(key, JSON.stringify([...currentState, state]))
    } catch (e) {
      console.error(e)
    }
  }

  const removeLastRedoState = spellid => {
    const key = `spell-state-redo-${spellid}`
    const currentState = JSON.parse(localStorage.getItem(key) || '[]')
    const state = currentState.pop()

    addUndoState(spellid, state)

    try {
      localStorage.setItem(key, JSON.stringify(currentState))
    } catch (e) {
      console.error(e)
      return null
    }

    return state
  }

  /**
   * Save the current spell
   */
  const saveSpell = useCallback(async () => {
    if (!spellRef.current) return
    const type = spellRef.current.type || 'spell'

    const currentSpell = spellRef.current
    const graph = currentSpell.graph
    if (!currentSpell) return

    const updatedSpell = {
      ...currentSpell,
      graph,
    }

    if (!updatedSpell.type) updatedSpell.type = type

    setIsSaving(true)
    dispatch(setSyncing(true))

    addUndoState(currentSpell.id, currentSpell)

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
      setIsSaving(false)
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
  }, [spellRef, saveSpellMutation, config.projectId, enqueueSnackbar])

  /**
   * Save an incremental diff of changes made in editor to the server
   * @param {object} event - The onSaveDiff event object
   * @param {object} update - The updated spell object
   */
  const onSaveDiff = useCallback(
    async (event, update, onSuccessCB) => {
      if (!spellRef.current) return true

      const currentSpell = spellRef.current
      const updatedSpell = {
        ...currentSpell,
        ...update,
      }

      if (currentSpell.spellReleaseId) return

      try {
        setIsSaving(true)
        dispatch(setSyncing(true))
        // We save the diff. Doing this via feathers but may want to switch to rtk query
        const response = await client.service('spells').patch(currentSpell.id, {
          ...updatedSpell,
          projectId: config.projectId,
        })
        // dispatch(applyState({ value: currentSpell, clearFuture: !isDirty }))

        addUndoState(currentSpell.id, currentSpell)

        spellRef.current = response
        onSuccessCB && onSuccessCB()
        // extend the timeout to 500ms to give the user a chance to see the sync icon
        setTimeout(() => {
          dispatch(setSyncing(false))
          setIsSaving(false)
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
    [dispatch, client, config.projectId, enqueueSnackbar, setIsSaving, spellRef]
  )

  /**
   * Trigger the undo action in the editor
   */
  const onUndo = useCallback(() => {
    console.log('UNDOING')
    if (!spellRef?.current?.id || isSaving) return
    const lastSpellState = removeLastUndoState(spellRef.current.id)

    if (!lastSpellState) return
    publish($RELOAD_GRAPH(tab.id), {
      spellState: lastSpellState,
      agentId: tab.agentId,
      projectId: config.projectId,
    })

    debounce(() => {
      onSaveDiff(null, lastSpellState, () => {})
    }, 500)
  }, [pastState, isSaving, onSaveDiff, publish, tab.id])

  /**
   * Trigger the redo action in the editor
   */
  const onRedo = useCallback(async () => {
    if (!spellRef?.current?.id || isSaving) return
    const lastSpellState = removeLastRedoState(spellRef.current.id)

    if (!lastSpellState) return
    publish($RELOAD_GRAPH(tab.id), {
      spellState: lastSpellState,
      agentId: tab.agentId,
      projectId: config.projectId,
    })
    onSaveDiff(null, lastSpellState, () => {})
  }, [futureState, isSaving, dispatch, onSaveDiff, publish, tab.id])

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
    [$UNDO(tab.id)]: onUndo,
    [$REDO(tab.id)]: onRedo,
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
