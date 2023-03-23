import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useSnackbar } from 'notistack'
import Editor from '@monaco-editor/react'
import { useDispatch } from 'react-redux'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { useHotkeys } from 'react-hotkeys-hook'
import { Button } from '@magickml/client-core'
// import Mic from '@mui/icons-material/Mic'


import {
  upsertLocalState,
  addLocalState,
  selectStateBytabId,
} from '../../../state/localState'
import { Select } from '@magickml/client-core'
import { usePubSub } from '../../../contexts/PubSubProvider'
import { Window } from '@magickml/client-core'
import css from '../../../screens/Chat/chat.module.css'
import { useFeathers } from '../../../contexts/FeathersProvider'
import { useAppSelector } from '../../../state/hooks'
import { useEditor } from '../../contexts/EditorProvider'

import { spellApi } from '../../../state/api/spells'
import { useConfig } from '../../../contexts/ConfigProvider'

import ChatUI from '../../../components/ChatUI'
import { USER, AGENT } from '../../../../../../lib/constants';

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
    <div className={css['chatwindow-input']}>
      <input
        ref={ref}
        type="text"
        value={props.value}
        onChange={props.onChange}
        placeholder="Type input here"
      ></input>
      {/* TODO: Add voice support */}
      {/* <Button
        className="small"
        style={{ cursor: 'pointer' }}
        onClick={}
      >
        <Mic fontSize="small" />
      </Button> */}
      <Button
        className="small"
        style={{ cursor: 'pointer' }}
        onClick={props.onSend}
      >
        Send
      </Button>
    </div >
  )
}

const ChatWindow = ({ tab }) => {
  const config = useConfig()

  const defaultchatwindowData = {
    sender: 'chatwindowSender',
    observer: 'Agent',
    type: 'chatwindow',
    client: 'chatwindow',
    channel: 'chatwindow',
    channelType: 'chatwindow',
    projectId: config.projectId,
    agentId: 'preview',
    entities: ['chatwindowSender', 'Agent'],
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
      projectId: config.projectId,
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
  const { $PLAYTEST_INPUT, $PLAYTEST_PRINT, $SAVE_SPELL_DIFF } = events

  const printToConsole = useCallback(
    (_, _text) => {
      console.log('_text', _text)
      const text = (`${AGENT}: ` + _text).split('\n')
      const newHistory = [...history, ...text]
      setHistory(newHistory as [])
    },
    [history]
  )

  // we want to set the options for the dropdown by parsing the spell graph
  // and looking for nodes with the chatwindowToggle set to true
  const [chatwindowOptions, setChatwindowOptions] = useState<Record<
    string,
    any
  > | null>([])
  const [chatwindowOption, setChatwindowOption] = useState(null)

  useEffect(() => {
    if (!spellData || spellData.data.length === 0 || !spellData.data[0].graph)
      return

    const graph = spellData.data[0].graph
    const options = Object.values(graph.nodes)
      .filter((node: any) => {
        return node.data.isInput
      })
      .map((node: any) => ({
        value: node.data.name ?? node.name,
        label: node.data.name ?? node.name,
      }))

    setChatwindowOptions(options)
    if (options.length > 0)
      setChatwindowOption(options[0].value)
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
    // TODO: Check if tab.id from chatwindow vs. playtest are the same
    if (!localState) {
      dispatch(
        addLocalState({
          id: tab.id,
          chatwindowData: JSON.stringify({ ...defaultchatwindowData }),
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
    const newHistory = [...history, `${USER}: ${value}`]
    setHistory(newHistory as [])

    let toSend = value
    setValue('')

    const json = localState?.chatwindowData
    console.log("🚀 ~ file: ChatWindow.tsx:208 ~ onSend ~ json:", json)
    // .replace(
    //   /(['"])?([a-z0-9A-Z_]+)(['"])?:/g,
    //   '"$2": '
    // )

    // if (!json) {
    //   enqueueSnackbar('No data provided', {
    //     variant: 'error',
    //   })
    //   return
    // }

    // validate the json
    try {
      JSON.parse(json)
    } catch (e) {
      enqueueSnackbar('Invalid data - JSON is poorly formatted', {
        variant: 'error',
      })
      return
    }

    toSend = {
      content: value,
      sender: 'Speaker',
      observer: 'Agent',
      agentId: 'preview',
      client: 'chatwindow',
      channel: 'previewChannel',
      projectId: config.projectId,
      channelType: 'previewChannelType',
      ...JSON.parse(json),
    }

    console.log('onSend', toSend)

    // get spell from editor
    const graph = serialize()
    if (!graph) {
      enqueueSnackbar('No graph found', {
        variant: 'error',
      })
    }

    console.log('chatwindowOption', chatwindowOption)

    const chatwindowNode = Object.values(graph.nodes).find(node => {
      return node.data.name === chatwindowOption
    })

    if (!chatwindowNode) {
      enqueueSnackbar('No input node found for this input type', {
        variant: 'error',
      })
      return
    }

    console.log('chatwindowNode', chatwindowNode)

    const chatwindowInputName = chatwindowNode?.data.name

    if (!chatwindowInputName) {
      enqueueSnackbar('No input node found for this input type', {
        variant: 'error',
      })
      return
    }

    publish($SAVE_SPELL_DIFF(tab.id), { graph: serialize() })

    // wait .2. seconds for spell_diff to take effect
    await new Promise(resolve => setTimeout(resolve, 200))

    const finalData = {
      spellName: tab.name.split('--')[0],
      id: tab.id,
      projectId: config.projectId,
      inputs: {
        [chatwindowInputName as string]: toSend,
      },
      // retrun an array of all nodes where node.data.isPublic is true
      publicVariables: JSON.stringify(Object.values(
        graph.nodes || {}
      ).filter((node: { data }) => node?.data?.isPublic)),
      secrets: JSON.parse(localStorage.getItem('secrets') || '{}')
    }

    // Todo should move run spell into an event to be used globally.
    client.service('spell-runner').create(finalData)

    publish($PLAYTEST_INPUT(tab.id), finalData)
    client.io.on(`${tab.id}-error`, data => {
      //publish($DEBUG_PRINT(tab.id), (data.error.message))
      console.error('Error in spell execution')
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
        chatwindowData: dataText ?? defaultchatwindowData,
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
    setChatwindowOption(value)
  }

  const toolbar = (
    <React.Fragment>
      <Select
        style={{ width: '100%', zIndex: 10 }}
        options={chatwindowOptions}
        onChange={onSelectChange}
        defaultValue={{
          value: chatwindowOption || null,
          label: chatwindowOption || 'No Inputs Found',
        }}
        placeholder="Select Input"
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
      {/*  This will slide down here and show another text area where you can input a json object for injection into the chatwindow.  Good for things that dont change often.  Ideal for Agents. */}
      <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
        <div
          className={css['chatwindow-output']}
          style={{ display: openData ? '' : 'none' }}
        >
          <Scrollbars ref={ref => (scrollbars.current = ref)}>
            <Editor
              theme="sds-dark"
              language="json"
              value={localState?.chatwindowData}
              options={options}
              defaultValue={
                localState?.chatwindowData || JSON.stringify(defaultchatwindowData)
              }
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
        <div className={css['chatwindow-output']}>
          <Scrollbars ref={ref => (scrollbars.current = ref)}>
            <ChatUI history={history} />
          </Scrollbars>
        </div>
        <label htmlFor="chatwindow-input" style={{ display: 'none' }}>
          Input
        </label>
        <Input onChange={onChange} value={value} onSend={onSend} />
      </div>
    </Window>
  )
}

export default ChatWindow
