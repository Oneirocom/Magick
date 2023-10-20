// DOCUMENTED
import { useConfig, usePubSub } from '@magickml/providers'
import {
  EditorContext,
  GetSpell,
  MagickWorkerInputs,
  OnDebug,
  OnEditor,
  OnInspector,
  ProcessCode,
  PublishEditorEvent,
  runPython,
  runSpellType,
  SpellInterface,
  SupportedLanguages,
} from 'shared/core'
import { spellApi } from 'client/state'
import { createContext, useContext } from 'react'

// Create context for EditorContext type
const Context = createContext<EditorContext | undefined>(undefined)

// Export hook for accessing editor context
export const useMagickInterface = () => useContext(Context)

/**
 * @class MagickInterfaceProvider A higher-order component used to provide a magick interface to child components.
 */
const MagickInterfaceProvider: React.FC<{
  children: React.ReactNode
  tab: any,
  spellId: string
}> = ({ children, tab, spellId }) => {
  const config = useConfig()
  const { events, publish, subscribe } = usePubSub()
  const [_runSpell] = spellApi.useRunSpellMutation()
  const [_getSpell] = spellApi.useLazyGetSpellByIdQuery()

  // Destructure event types
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
    $REFRESH_EVENT_TABLE,
  } = events

  /**
   * @function refreshEventTable
   * @description Refreshes the event table for the selected tab.
   */
  const refreshEventTable = () => {
    return publish($REFRESH_EVENT_TABLE(tab.id))
  }

  // Implement various event handling functions
  const onInspector: OnInspector = (node, callback) => {
    return subscribe(
      $NODE_SET(tab.id, node.id),
      (_event: string, data: any) => {
        if (typeof data === 'string') {
          throw new Error('onInspector: data is a string')
        }
        callback(data as Record<string, unknown>)
      }
    )
  }

  const onAddModule: OnEditor = callback => {
    return subscribe(ADD_SUBSPELL, (_event: string, data: any) => {
      callback(data)
    })
  }

  const onUpdateModule: OnEditor = callback => {
    return subscribe(UPDATE_SUBSPELL, (_event: string, data: any) => {
      callback(data)
    })
  }

  // @ts-ignore
  const onSubspellUpdated: OnDebug = (spellName, callback) => {
    // return subscribe($SUBSPELL_UPDATED(spellName), (_event: string, data: any) => {
    //   callback(data);
    // });
  }

  const onDeleteModule: OnEditor = callback => {
    return subscribe(UPDATE_SUBSPELL, (_event: string, data: any) => {
      callback(data)
    })
  }

  const sendToInspector: PublishEditorEvent = data => {
    publish($INSPECTOR_SET(tab.id), data)
  }

  const sendToDebug: PublishEditorEvent = data => {
    publish($DEBUG_PRINT(tab.id), data)
  }

  const onDebug: OnDebug = (node, callback) => {
    return subscribe($DEBUG_INPUT(tab.id), (_event: string, data: any) => {
      callback(data)
    })
  }

  const sendToPlaytest: (data: string) => void = data => {
    publish($PLAYTEST_PRINT(tab.id), data)
  }

  const onPlaytest: OnEditor = callback => {
    return subscribe($PLAYTEST_INPUT(tab.id), (_event: string, data: any) => {
      setTimeout(() => callback(data), 0)
    })
  }

  const getSpell: GetSpell = async spellName => {
    const spell = await _getSpell({
      spellName,
      id: spellId,
      projectId: config.projectId,
    })

    if (!spell.data) return null

    return spell.data[0] as SpellInterface
  }

  const processCode: ProcessCode = async (
    code: unknown,
    inputs: MagickWorkerInputs,
    data: unknown,
    state: any,
    language: SupportedLanguages = 'javascript'
  ) => {
    const flattenedInputs = Object.entries(inputs).reduce(
      (acc, [key, value]) => {
        acc[key] = value[0]
        return acc
      },
      {} as Record<string, any>
    )

    if (language === 'javascript') {
      const result = new Function('"use strict";return (' + code + ')')()(
        flattenedInputs,
        data
      )
      return result
    }

    if (language === 'python') {
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

  // Define public interface for context
  const publicInterface = {
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
  }

  // Provide the public interface to child components
  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

export default MagickInterfaceProvider
