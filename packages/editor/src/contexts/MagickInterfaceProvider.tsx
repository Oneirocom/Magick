import {
  EditorContext,
  GetSpell,
  MagickWorkerInputs,
  OnDebug,
  OnEditor,
  OnInspector,
  ProcessCode,
  PublishEditorEvent, runPython, runSpellType,
  Spell,
  SupportedLanguages
} from '@magickml/engine'
import { createContext, useContext, useEffect, useRef } from 'react'

import { useConfig } from '../contexts/ConfigProvider'
import { usePubSub } from '../contexts/PubSubProvider'
import { spellApi } from '../state/api/spells'

// TODO: does it also work without the !?
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const Context = createContext<EditorContext>(undefined!)

export const useMagickInterface = () => useContext(Context)

const MagickInterfaceProvider = ({ children, tab }) => {
  const config = useConfig()

  const { events, publish, subscribe } = usePubSub()
  const spellRef = useRef<Spell | null>(null)
  const [_runSpell] = spellApi.useRunSpellMutation()
  const [_getSpell] = spellApi.useLazyGetSpellByIdQuery()
  const { data: _spell } = spellApi.useGetSpellByIdQuery(
    {
      spellName: tab.name.split('--')[0],
      id: tab.id,
      projectId: config.projectId,
    },
    {
      skip: !tab.name.split('--')[0],
    }
  )

  const env = {
    API_ROOT_URL: import.meta.env.API_ROOT_URL,
  }
  useEffect(() => {
    if (!_spell) return
    spellRef.current = _spell.data[0]
  }, [_spell])

  const {
    $PLAYTEST_INPUT,
    $PLAYTEST_PRINT,
    $INSPECTOR_SET,
    $DEBUG_PRINT,
    $DEBUG_INPUT,
    $TEXT_EDITOR_CLEAR,
    $NODE_SET,
    ADD_SUBSPELL,
    UPDATE_SUBSPELL,
    $SUBSPELL_UPDATED,
    $PROCESS,
    $TRIGGER,
    $REFRESH_EVENT_TABLE,
    $SEND_TO_AVATAR,
  } = events

  const getCurrentSpell = () => {
    return spellRef.current
  }

  // TODO: tech debt.  Check if this is still needed
  /**
   * @deprecated The method should not be used
   */
  const onTrigger = (node, callback) => {
    const isDefault = node === 'default' ? 'default' : null
    return subscribe($TRIGGER(tab.id, isDefault ?? node.id), (event, data) => {
      publish($PROCESS(tab.id))
      // weird hack.  This staggers the process slightly to allow the published event to finish before the callback runs.
      // No super elegant, but we need a better more centralised way to run the engine than these callbacks.
      setTimeout(() => callback(data), 0)
    })
  }

  const refreshEventTable = () => {
    return publish($REFRESH_EVENT_TABLE(tab.id))
  }

  const onInspector: OnInspector = (node, callback) => {
    return subscribe($NODE_SET(tab.id, node.id), (_event, data) => {
      // TODO: handle this more gracefully?
      if (typeof data === 'string') {
        throw new Error('onInspector: data is a string')
      }
      callback(data)
    })
  }

  const onAddModule: OnEditor = callback => {
    return subscribe(ADD_SUBSPELL, (event, data) => {
      callback(data)
    })
  }

  const onUpdateModule: OnEditor = callback => {
    return subscribe(UPDATE_SUBSPELL, (event, data) => {
      callback(data)
    })
  }

  const onSubspellUpdated: OnDebug = (spellName, callback) => {
    return subscribe($SUBSPELL_UPDATED(spellName), (event, data) => {
      callback(data)
    })
  }

  const onDeleteModule: OnEditor = callback => {
    return subscribe(UPDATE_SUBSPELL, (event, data) => {
      callback(data)
    })
  }

  const sendToInspector: PublishEditorEvent = data => {
    // TODO: should the return value be used?
    publish($INSPECTOR_SET(tab.id), data)
  }

  const sendToDebug: PublishEditorEvent = data => {
    publish($DEBUG_PRINT(tab.id), data)
  }

  const onDebug: OnDebug = (node, callback) => {
    return subscribe($DEBUG_INPUT(tab.id, node.id), (event, data) => {
      callback(data)
    })
  }

  const sendToPlaytest: (data: string) => void = data => {
    console.log('sending to playtest', data)
    publish($PLAYTEST_PRINT(tab.id), data)
  }

  const onPlaytest: OnEditor = callback => {
    return subscribe($PLAYTEST_INPUT(tab.id), (event, data) => {
      // publish($PROCESS(tab.id))
      // weird hack.  This staggers the process slightly to allow the published event to finish before the callback runs.
      // No super elegant, but we need a better more centralised way to run the engine than these callbacks.
      setTimeout(() => callback(data), 0)
    })
  }

  const getSpell: GetSpell = async spellName => {
    const spell = await _getSpell({
      spellName,
      id: tab.id,
      projectId: config.projectId,
    })

    if (!spell.data) return null

    return spell.data[0] as Spell
  }

  const processCode: ProcessCode = async (
    code: unknown,
    inputs: MagickWorkerInputs,
    data: unknown,
    //TODO: remove unused state which is not used in interface?
    state,
    language: SupportedLanguages = 'javascript'
  ) => {
    const flattenedInputs = Object.entries(inputs as MagickWorkerInputs).reduce(
      (acc, [key, value]) => {
        acc[key as string] = value[0] as any
        return acc
      },
      {} as Record<string, any>
    )
    if (language === 'javascript') {
      // eslint-disable-next-line no-new-func
      const result = new Function('"use strict";return (' + code + ')')()(
        flattenedInputs,
        data
      )
      return result
    } else if (language === 'python') {
      try {
        const result = await runPython(
          code + '\n worker(inputs, data)',
          flattenedInputs,
          data
        )

        return result
      } catch (err) {
        console.error({ err })
      }
    }
  }

  const runSpell = async ({ inputs, spellId, projectId }: runSpellType) => {
    const response = await _runSpell({ inputs, spellId, projectId })

    if ('error' in response) {
      throw new Error(`Error running spell ${spellId}`)
    }

    return response.data.outputs
  }

  const clearTextEditor = () => {
    publish($TEXT_EDITOR_CLEAR(tab.id))
  }
  const publicInterface = {
    env,
    onTrigger,
    onInspector,
    onAddModule,
    onUpdateModule,
    onDeleteModule,
    onSubspellUpdated,
    sendToInspector,
    sendToDebug,
    onDebug,
    sendToPlaytest,
    onPlaytest,
    clearTextEditor,
    processCode,
    runSpell,
    refreshEventTable,
    getSpell,
    getCurrentSpell,
  }

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

export default MagickInterfaceProvider
