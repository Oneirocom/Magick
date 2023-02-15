import axios from 'axios'
import {
  CreateEventArgs,
  EditorContext,
  Spell,
  MagickWorkerInputs,
  CompletionBody,
  QAArgs,
} from '@magickml/engine'
import { createContext, useContext, useEffect, useRef } from 'react'

import {
  useGetSpellQuery,
  useLazyGetSpellQuery,
  useRunSpellMutation,
} from '../../state/api/spells'

import { usePubSub } from '../../contexts/PubSubProvider'
import { magickApiRootUrl } from '../../config'

import { runPython } from '@magickml/engine'

const Context = createContext<EditorContext>(undefined!)

export const useMagickInterface = () => useContext(Context)

const MagickInterfaceProvider = ({ children, tab }) => {
  const { events, publish, subscribe } = usePubSub()
  const spellRef = useRef<Spell | null>(null)
  const [_runSpell] = useRunSpellMutation()
  const [_getSpell] = useLazyGetSpellQuery()
  const { data: _spell } = useGetSpellQuery(
    {
      spellId: tab.spellId,
    },
    {
      skip: !tab.spellId,
    }
  )

  const env = {
    API_ROOT_URL: import.meta.env.API_ROOT_URL,
    API_URL: import.meta.env.API_URL,
    APP_SEARCH_SERVER_URL: import.meta.env.APP_SEARCH_SERVER_URL,
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
    $SAVE_SPELL_DIFF,
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

  const onTrigger = (node, callback) => {
    let isDefault = node === 'default' ? 'default' : null
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

  const onInspector = (node, callback) => {
    return subscribe($NODE_SET(tab.id, node.id), (event, data) => {
      callback(data)
    })
  }

  const onAddModule = callback => {
    return subscribe(ADD_SUBSPELL, (event, data) => {
      callback(data)
    })
  }

  const onUpdateModule = callback => {
    return subscribe(UPDATE_SUBSPELL, (event, data) => {
      callback(data)
    })
  }

  const onSubspellUpdated = (spellId: string, callback: Function) => {
    return subscribe($SUBSPELL_UPDATED(spellId), (event, data) => {
      callback(data)
    })
  }

  const onDeleteModule = callback => {
    return subscribe(UPDATE_SUBSPELL, (event, data) => {
      callback(data)
    })
  }

  const sendToInspector = data => {
    publish($INSPECTOR_SET(tab.id), data)
  }

  const sendToDebug = data => {
    publish($DEBUG_PRINT(tab.id), data)
  }

  const onDebug = (node, callback) => {
    return subscribe($DEBUG_INPUT(tab.id, node.id), (event, data) => {
      callback(data)
    })
  }

  const sendToPlaytest = data => {
    publish($PLAYTEST_PRINT(tab.id), data)
  }

  const sendToAvatar = data => {
    publish($SEND_TO_AVATAR(tab.id), data)
  }

  const onPlaytest = callback => {
    return subscribe($PLAYTEST_INPUT(tab.id), (event, data) => {
      // publish($PROCESS(tab.id))
      // weird hack.  This staggers the process slightly to allow the published event to finish before the callback runs.
      // No super elegant, but we need a better more centralised way to run the engine than these callbacks.
      setTimeout(() => callback(data), 0)
    })
  }

  const getSpell = async spellId => {
    const spell = await _getSpell(spellId)

    return spell.data[0] as Spell
  }

  const processCode = async (
    code,
    inputs,
    data,
    state,
    language = 'javascript'
  ) => {
    const flattenedInputs = Object.entries(inputs as MagickWorkerInputs).reduce(
      (acc, [key, value]) => {
        acc[key as string] = value[0] as any
        return acc
      },
      {} as Record<string, any>
    )
    if (language == 'javascript') {
      console.log('processCode, javascript')

      // eslint-disable-next-line no-new-func
      const result = new Function('"use strict";return (' + code + ')')()(
        flattenedInputs,
        data
      )
      return result
    } else if (language == 'python') {
      try {
        const result = await runPython(code, flattenedInputs, data)

        return result
      } catch (err) {
        console.log({ err })
      }
    }
  }

  const runSpell = async (inputs, spellId) => {
    const response = await _runSpell({ inputs, spellId })

    if ('error' in response) {
      throw new Error(`Error running spell ${spellId}`)
    }

    return response.data.outputs
  }

  const clearTextEditor = () => {
    publish($TEXT_EDITOR_CLEAR(tab.id))
  }

  const queryGoogle = async (query: string) => {
    const url = `${magickApiRootUrl}/query_google`
    const response = await axios.post(url, {
      query,
    })

    const summary = response.data.summary
    const links = response.data.links.join('\n')
    console.log('summary is ', summary)

    return { summary, links }
  }

  const completion = async (body: CompletionBody) => {
    const url = `${
      import.meta.env.VITE_APP_API_URL || 'http://localhost:3030'
    }/text_completion`

    const apiKey = window.localStorage.getItem('openai-api-key')

    const openAICredentials = window.localStorage.getItem('openai')
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...body,
        apiKey: openAICredentials ? JSON.parse(openAICredentials).apiKey : '',
      }),
    })

    const data = await resp.json()

    console.log('resp.data is ', data)

    const { success, choice } = data

    return { success, choice }
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
    queryGoogle,
    sendToAvatar,
    getSpell,
    completion,
    getCurrentSpell,
  }

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

export default MagickInterfaceProvider
