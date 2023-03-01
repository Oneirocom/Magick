import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useSnackbar } from 'notistack'
import Editor from '@monaco-editor/react'
import { useDispatch } from 'react-redux'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { useHotkeys } from 'react-hotkeys-hook'
import { getStore } from 'packages/editor/src/state/store'
import {
  upsertLocalState,
  addLocalState,
  selectStateBytabId,
} from '../../../state/localState'
import { Select } from '@magickml/client-core' 
import { usePubSub } from '../../../contexts/PubSubProvider'
import { Window } from '@magickml/client-core'
import css from '../../../screens/Magick/magick.module.css'
import { useFeathers } from '../../../contexts/FeathersProvider'
import { useAppSelector } from '../../../state/hooks'
import { useEditor } from '../../contexts/EditorProvider'

import { getSpellApi } from '../../../state/api/spells'
import { useConfig } from '../../../contexts/ConfigProvider'
import { Button } from '@magickml/client-core'
import { pluginManager } from '@magickml/engine'
import { toast } from 'react-toastify'

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
      <Button
        className="small"
        style={{ cursor: 'pointer' }}
        onClick={props.onSend}
      >
        Send
      </Button>
    </div>
  )
}

const Playtest = ({ tab }) => {
  const config = useConfig()
  const spellApi = getSpellApi(config)

  const defaultPlaytestData = {
    "sender": "playtestSender",
    "observer": "playtestObserver",
    "type": "playtest",
    "client": "playtest",
    "channel": "playtest",
    "channelType": "playtest",
    "projectId": config.projectId,
    "agentId": 0,
    "entities": ["playtestSender", "playtestObserver"]
  }

  const scrollbars = useRef<any>()
  const [history, setHistory] = useState([])
  const [value, setValue] = useState('')
  const [openData, setOpenData] = useState<boolean>(false)

  const { publish, subscribe, events } = usePubSub()
  const FeathersContext = useFeathers()
  const dispatch = useDispatch()
  const { serialize } = useEditor()
  const { enqueueSnackbar } = useSnackbar()
  const { data: spellData } = spellApi.useGetSpellByIdQuery(
    { 
      spellName: tab.name.split('--')[0], 
      id: tab.id, 
      projectId: config.projectId 
    },
    {
      refetchOnMountOrArgChange: true,
      skip: !tab.name.split('--')[0],
    }
  )

  // const localState = {} as any

  const localState = useAppSelector(state => {
    return selectStateBytabId(state.localState, tab.id)
  })
  const client = FeathersContext?.client
  const { $PLAYTEST_INPUT, $PLAYTEST_PRINT, $DEBUG_PRINT } = events

  const printToConsole = useCallback(
    (_, _text) => {
      const text = typeof _text === 'object' ? JSON.stringify(_text) : _text
      const newHistory = [...history, text]
      setHistory(newHistory as [])
    },
    [history]
  )

  // we want to set the options for the dropdown by parsing the spell graph
  // and looking for nodes with the playtestToggle set to true
  const [playtestOptions, setPlaytestOptions] = useState<Record<
    string,
    any
  > | null>(['Default'])
  const [playtestOption, setPlaytestOption] = useState('Default')

  useEffect(() => {
    if (!spellData || spellData.data.length === 0 || !spellData.data[0].graph) return

    const options = ['Default', ...pluginManager.getInputTypes()]

    const optionsObj = options
    .map((option: any) => ({
      value: option,
      label: option,
    }))

    setPlaytestOptions(optionsObj)
  }, [spellData])

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
      dispatch(
        addLocalState({
          id: tab.id,
          playtestData: JSON.stringify({...defaultPlaytestData}),
        })
      )
      return
    }
  }, [localState])

  const options = {
    minimap: {
      enabled: false,
    },
    wordWrap: 'bounded' as const,
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

  const onSend = async () => {
   
    const newHistory = [...history, `You: ${value}`]
    setHistory(newHistory as [])

    let toSend = value

    const json = localState?.playtestData.replace(
      /(['"])?([a-z0-9A-Z_]+)(['"])?:/g,
      '"$2": '
    )

    if (!json) {
      enqueueSnackbar('No data provided', {
        variant: 'error',
      })
      return;
    }
    

    // validate the json
    try {
      JSON.parse(json)
    } catch (e) {
      enqueueSnackbar('Invalid data - JSON is poorly formatted', {
        variant: 'error',
      })
      return;
    }

    toSend = {
      content: value,
      sender: 'Speaker',
      observer: 'Agent',
      agentId: 0,
      client: 'playtest',
      channel: 'previewChannel',
      projectId: config.projectId,
      channelType: 'previewChannelType',
      ...JSON.parse(json),
    }
    

    // get spell from editor
    const graph = serialize()
    if (!graph) return

    const playtestNode = Object.values(graph.nodes).find(
      node => {
        return node.data.playtestToggle && node.data.name === `Input - ${playtestOption}`
      })

      if(!playtestNode) {
        toast.error('No input node found for this input type')
        return;
      }
    

    const playtestInputName = playtestNode?.data.name || 'Input - Default'

    if (!playtestInputName) return
    client.service('spell-runner').create({
      spellName: tab.name.split('--')[0],
      id: tab.id,
      projectId: config.projectId,
      inputs: {
        [playtestInputName as string]: toSend,
      },
    })
    
    publish($PLAYTEST_INPUT(tab.id), toSend)
    client.io.on(`${tab.id}-error`, (data) => {
      //publish($DEBUG_PRINT(tab.id), (data.error.message))
      console.error("Error in spell execution")
      enqueueSnackbar('Error Running the spell. Please Check the Console', {
        variant: 'error',
      })
    })
    
    setValue('')
  }

  const onDataChange = dataText => {
    dispatch(
      upsertLocalState({
        id: tab.id,
        playtestData: dataText ?? JSON.stringify(defaultPlaytestData),
      })
    )
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

  const onSelectChange = async ({ value }) => {
    setPlaytestOption(value)
  }

  const toolbar = (
    <React.Fragment>
      <Select
        style={{ width: '100%', zIndex: 10 }}
        options={playtestOptions}
        onChange={onSelectChange}
        defaultValue={{value: playtestOption || 'Default', label: playtestOption || 'Default'}}
        placeholder={playtestOption || 'Default'}
        creatable={false}
      />

      <Button className="small" style={{ cursor: 'pointer' }} onClick={onClear}>
        Clear
      </Button>
      <Button
        className="small"
        style={{ cursor: 'pointer' }}
        onClick={toggleData}
      >
        Data
      </Button>
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
              defaultValue={localState?.playtestData || JSON.stringify(defaultPlaytestData)}
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
        <label htmlFor="playtest-input" style={{ display: 'none' }}>
          Input
        </label>
        <Input onChange={onChange} value={value} onSend={onSend} />
      </div>
    </Window>
  )
}

export default Playtest
