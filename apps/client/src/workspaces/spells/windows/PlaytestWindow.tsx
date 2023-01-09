import React, { useState, useEffect, useCallback, useRef } from 'react'
import Editor from '@monaco-editor/react'
import { useDispatch, useSelector } from 'react-redux'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { useHotkeys } from 'react-hotkeys-hook'

import {
  upsertLocalState,
  selectStateBySpellId,
  addLocalState,
} from '../../../state/localState'
import { usePubSub } from '../../../contexts/PubSubProvider'
import Window from '../../../components/Window/Window'
import css from '../../../screens/Magick/magick.module.css'
import { useFeathers } from '../../../contexts/FeathersProvider'
import { feathers as feathersFlag } from '../../../config'
import { useAppSelector } from '../../../state/hooks'

const Input = props => {
  const ref = useRef() as React.MutableRefObject<HTMLInputElement>
  useHotkeys(
    'return',
    () => {
      if (ref.current !== document.activeElement) return
      props.onSend()
    },
    // Not sure why it says INPUT is not a valid AvailableTag when it clearly is
    { enableOnTags: 'INPUT' as any },
    [props, ref]
  )

  return (
    <div className={css['playtest-input']}>
      <input
        ref={ref}
        type="text"
        value={props.value}
        onChange={props.onChange}
      ></input>
      <button className="small" onClick={props.onSend}>
        Send
      </button>
    </div>
  )
}

const Playtest = ({ tab }) => {
  const scrollbars = useRef<any>()
  const [history, setHistory] = useState([])
  const [value, setValue] = useState('')
  const [openData, setOpenData] = useState<boolean>(false)

  const { publish, subscribe, events } = usePubSub()
  const FeathersContext = useFeathers()
  const dispatch = useDispatch()

  const localState = useAppSelector(state =>
    selectStateBySpellId(state.localState, tab.spellId)
  )

  const client = FeathersContext?.client
  const { $PLAYTEST_INPUT, $PLAYTEST_PRINT } = events

  const printToConsole = useCallback(
    (_, _text) => {
      let text = typeof _text === 'object' ? JSON.stringify(_text) : _text
      const newHistory = [...history, text]
      setHistory(newHistory as [])
    },
    [history]
  )

  // Keep scrollbar at bottom of its window
  useEffect(() => {
    if (!scrollbars.current) return
    scrollbars.current.scrollToBottom()
  }, [history])
  useEffect(() => {
    const unsubscribe = subscribe($PLAYTEST_PRINT(tab.id), printToConsole)

    // return a clean up function
    return unsubscribe as () => void
  }, [subscribe, printToConsole, $PLAYTEST_PRINT])

  // Sync up localState into data field for persistence
  useEffect(() => {
    // Set up a default for the local state here
    if (!localState) {
      dispatch(addLocalState({ spellId: tab.spellId, playtestData: '{}' }))
      return
    }
  }, [localState])

  const options = {
    minimap: {
      enabled: false,
    },
    wordWrap: 'bounded' as 'bounded',
    fontSize: 14,
  }

  const handleEditorWillMount = monaco => {
    monaco.editor.defineTheme('sds-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#272727',
      },
    })
  }

  const onSend = () => {
    const newHistory = [...history, `You: ${value}`]
    setHistory(newHistory as [])
    if (feathersFlag) {
      client.service('spell-runner').create({
        spellId: tab.spellId,
        inputs: {
          input: value,
        },
      })
    }

    let toSend = value

    if (localState?.playtestData !== '{}') {
      const json = localState?.playtestData.replace(
        /(['"])?([a-z0-9A-Z_]+)(['"])?:/g,
        '"$2": '
      )

      // IMPLEMENT THIS: https://www.npmjs.com/package/json5

      // todo could throw an error here
      if (!json) return

      toSend = {
        input: value,
        ...JSON.parse(json),
      }
    }

    publish($PLAYTEST_INPUT(tab.id), toSend)
    setValue('')
  }

  const onDataChange = dataText => {
    console.log('new data text', dataText)
    dispatch(upsertLocalState({ spellId: tab.spellId, playtestData: dataText }))
  }

  const onChange = e => {
    setValue(e.target.value)
  }

  const onClear = () => {
    setHistory([])
  }

  const toggleData = () => {
    setOpenData(!openData)
  }

  const toolbar = (
    <React.Fragment>
      <form>
        <label htmlFor="api-key">API Key</label>
        <input
          type="password"
          id="api-key"
          name="api-key"
          value="api-key"
          onChange={e => localStorage.setItem('openai-api-key', e.target.value)}
        />
      </form>
      <button className="small" onClick={onClear}>
        Clear
      </button>
      <button className="small" onClick={toggleData}>
        Data
      </button>
    </React.Fragment>
  )
  if (document.getElementById('api-key')) {
    document
      .getElementById('api-key')
      ?.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          event.preventDefault()
        }
      })
  }

  const printItem = (text, key) => <li key={key}>{text}</li>

  return (
    <Window toolbar={toolbar}>
      {/*  This will slide down here and show another text area where you can input a javascript object for injection into the playtest.  Good for things that dont change often.  Ideal for Agents. */}
      <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
        <div
          className={css['playtest-output']}
          style={{ display: openData ? '' : 'none' }}
        >
          <Scrollbars ref={ref => (scrollbars.current = ref)}>
            <Editor
              theme="sds-dark"
              language="javascript"
              value={localState?.playtestData}
              options={options}
              defaultValue={localState?.playtestData || '{}'}
              onChange={onDataChange}
              beforeMount={handleEditorWillMount}
            />
          </Scrollbars>
        </div>
        <div
          style={{
            height: 'var(--c1)',
            backgroundColor: 'var(--dark-3)',
            display: openData ? '' : 'none',
          }}
        ></div>
        <div className={css['playtest-output']}>
          <Scrollbars ref={ref => (scrollbars.current = ref)}>
            <ul>{history.map(printItem)}</ul>
          </Scrollbars>
        </div>
        <label htmlFor="playtest-input" style={{ marginTop: 10 }}>
          Input
        </label>
        <Input onChange={onChange} value={value} onSend={onSend} />
      </div>
    </Window>
  )
}

export default Playtest
