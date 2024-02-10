// DOCUMENTED
import { useEffect, useRef } from 'react'
import { useSnackbar } from 'notistack'

import md5 from 'md5'

import { diff } from '../../utils/json0'

import { useConfig, useFeathers } from '@magickml/providers'
import {
  useLazyGetSpellQuery,
  useSaveSpellMutation,
  setSyncing,
} from 'client/state'
import { useDispatch } from 'react-redux'
import { SpellInterface } from 'server/schemas'

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

  const { events, subscribe } = pubSub

  const { $DELETE, $UNDO, $REDO, $SAVE_SPELL, $SAVE_SPELL_DIFF, $EXPORT } =
    events

  /**
   * Save the current spell
   */
  const saveSpell = async () => {
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

    try {
      dispatch(setSyncing(true))
      // We save the diff. Doing this via feathers but may want to switch to rtk query
      const diffResponse = await client.service('spells').saveDiff({
        projectId: config.projectId,
        diff: jsonDiff,
        name: currentSpell.name,
        spellId: currentSpell.id,
      })

      spellRef.current = diffResponse

      // extend the timeout to 500ms to give the user a chance to see the sync icon
      setTimeout(() => {
        dispatch(setSyncing(false))
      }, 1000)

      // invalidate the spell cache in rtk query
      // dispatch(spellApi.util.invalidateTags(['Spell']))

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

  /**
   * Trigger the undo action in the editor
   */
  const onUndo = () => {
    console.warn('undo not implemented yet')
  }

  /**
   * Trigger the redo action in the editor
   */
  const onRedo = () => {
    console.warn('redo not implemented yet')
  }

  /**
   * Trigger the delete action in the editor
   */
  const onDelete = () => {
    console.warn('delete not implemented yet')
  }

  /**
   * Export the current spell to a JSON file
   */
  const onExport = async () => {
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

    if (!link.parentNode) return

    // Clean up and remove the link
    link.parentNode.removeChild(link)
  }

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
