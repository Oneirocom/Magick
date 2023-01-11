import axios from 'axios'
import {
  CreateEventArgs,
  EditorContext,
  Spell,
  MagickWorkerInputs,
  CompletionBody,
} from '@magickml/core'
import { createContext, useContext, useEffect, useRef } from 'react'

import {
  useGetSpellQuery,
  useLazyGetSpellQuery,
  useRunSpellMutation,
} from '../../state/api/spells'

import { usePubSub } from '../../contexts/PubSubProvider'
import { magickApiRootUrl } from '../../config'
 
import run_python from '../../../../../packages/core/src/ProcessPython'

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

  useEffect(() => {
    if (!_spell) return
    spellRef.current = _spell
  }, [_spell])

  // run_python("https://cdn.jsdelivr.net/pyodide/v0.22.0/full/pyodide.js");

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
      publish($PROCESS(tab.id))
      // weird hack.  This staggers the process slightly to allow the published event to finish before the callback runs.
      // No super elegant, but we need a better more centralised way to run the engine than these callbacks.
      setTimeout(() => callback(data), 0)
    })
  }

  const getSpell = async spellId => {
    const spell = await _getSpell(spellId)

    return spell.data as Spell
  }

  const  processCode = async (code, inputs, data, state, language='javascript') => {
    console.log('processCode')
    if (language == 'javascript'){
      console.log('processCode, javascript')
      const flattenedInputs = Object.entries(inputs as MagickWorkerInputs).reduce(
        (acc, [key, value]) => {
          acc[key as string] = value[0] as any
          return acc
        },
        {} as Record<string, any>
      )
      // eslint-disable-next-line no-new-func
      const result = new Function('"use strict";return (' + code + ')')()(
        flattenedInputs,
        data,
        state
      )
      if (result.state) {
        updateCurrentGameState(result.state)
      }
      return result
    } else if (language == 'python') {
      try {
        return run_python(code);
        // console.log('processCode, python')
        // let pyodide = await global.loadPyodide();
        // const codeResult = pyodide.runPython("1 + 10");
        // console.log('coderesult', codeResult);
      } catch (err) {
        console.log({ err })
      }

    }  
    
  }

  const runSpell = async (inputs, spellId, state) => {
    const response = await _runSpell({ inputs, spellId, state })

    if ('error' in response) {
      throw new Error(`Error running spell ${spellId}`)
    }

    return response.data.outputs
  }

  const clearTextEditor = () => {
    publish($TEXT_EDITOR_CLEAR(tab.id))
  }

  const getCurrentGameState = () => {
    if (!spellRef.current) return {}

    return spellRef.current?.gameState ?? {}
  }

  const setCurrentGameState = newState => {
    if (!spellRef.current) return

    const update = {
      gameState: newState,
    }
    // publish($SAVE_SPELL_DIFF(tab.id), update)
  }

  const updateCurrentGameState = _update => {
    if (!spellRef.current) return
    const spell = spellRef.current

    // lets delete out all undefined properties coming in
    Object.keys(_update).forEach(
      key => _update[key] === undefined && delete _update[key]
    )

    const update = {
      gameState: {
        ...spell.gameState,
        ..._update,
      },
    }

    // Temporarily update the spell refs game state to account for multiple state writes in a spell run
    spellRef.current = {
      ...spell,
      ...update,
    }
    // publish($SAVE_SPELL_DIFF(tab.id), update)
  }

  const getEvent = async ({
    type,
    agent,
    speaker,
    client,
    channel,
    maxCount = 10,
    target_count = 'single',
    max_time_diff = -1,
  }) => {
    const urlString = `${
      import.meta.env.VITE_APP_API_URL ??
      import.meta.env.API_ROOT_URL
    }/event`

    const params = {
      type: type,
      agent: agent,
      speaker: speaker,
      client: client,
      channel: channel,
      maxCount: maxCount,
      target_count,
      max_time_diff,
    } as Record<string, any>

    const url = new URL(urlString)
    for (let p in params) {
      url.searchParams.append(p, params[p])
    }

    const response = await fetch(url.toString())
    if (response.status !== 200) return null
    const json = await response.json()
    return json.event
  }

  const storeEvent = async ({
    type,
    agent,
    speaker,
    text,
    client,
    channel,
  }: CreateEventArgs) => {
    const response = await axios.post(
      `${
        import.meta.env.VITE_APP_API_URL ??
        import.meta.env.API_ROOT_URL
      }/event`,
      {
        type,
        agent,
        speaker,
        text,
        client,
        channel,
      }
    )
    console.log('Created event', response.data)
    return response.data
  }

  const getWikipediaSummary = async (keyword: string) => {
    const isProd = import.meta.env.NODE_ENV === 'production'
    const root = isProd
      ? 'https://magick.supereality.com'
      : 'htts://localhost:8001'
    const url = `${root}/wikipediaSummary?keyword=${keyword}`

    console.log('FETCHOING FROM URL', url)

    const response = await fetch(url)

    return await response.json()
  }

  const queryGoogle = async (query: string) => {
    const url = `${magickApiRootUrl}/query_google`
    const response = await axios.post(url, {
      query,
    })

    return await response.data.result
  }

  const completion = async (body: CompletionBody) => {
    const url = `${
      import.meta.env.VITE_APP_API_URL || 'http://localhost:8001'
    }/text_completion`

    const apiKey = window.localStorage.getItem('openai-api-key')

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...body,
        apiKey,
      }),
    })

    const data = await resp.json()

    console.log('resp.data is ', data)

    const { success, choice } = data

    return { success, choice }
  }

  const publicInterface = {
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
    getCurrentGameState,
    setCurrentGameState,
    updateCurrentGameState,
    processCode,
    runSpell,
    refreshEventTable,
    getEvent,
    storeEvent,
    getWikipediaSummary,
    queryGoogle,
    sendToAvatar,
    getSpell,
    completion,
  }

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

export default MagickInterfaceProvider
