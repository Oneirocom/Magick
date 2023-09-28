// DOCUMENTED
import { Button, Select, Window } from 'client/core'
import Editor from '@monaco-editor/react'
import { useSnackbar } from 'notistack'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { useHotkeys } from 'react-hotkeys-hook'
import { useDispatch, useSelector } from 'react-redux'
import { useEditor } from '../contexts/EditorProvider'
import { useInspector } from '../contexts/InspectorProvider'
import { usePubSub, useConfig } from '@magickml/providers'
import css from '../screens/Magick/magick.module.css'
import {
  RootState,
  addLocalState,
  selectStateBytabId,
  spellApi,
  upsertLocalState,
  useAppSelector,
} from 'client/state'

/**
 * Input component - Receives and sends playtest input.
 */
const Input = props => {
  const ref = useRef() as React.MutableRefObject<HTMLInputElement>

  const [playtestCache, setPlaytestCache] = useState<string[]>([])

  // Trigger 'onSend' when 'return' key is pressed on the input.
  useHotkeys(
    'enter',
    () => {
      if (ref.current !== document.activeElement) return
      onSend()
    },
    { enableOnFormTags: ['INPUT'] },
    [props, ref]
  )

  // Use up and down arrows to move through history and set valye of input.
  useHotkeys(
    'up',
    () => {
      if (ref.current !== document.activeElement) return
      if (playtestCache.length === 0) return
      const last = playtestCache[playtestCache.length - 1]

      // handle case where user is moving up more than one
      if (ref.current.value !== '') {
        const index = playtestCache.indexOf(ref.current.value)
        if (index === -1) {
          // if the current value is not in the playtestCache, add it to the playtestCache
          setPlaytestCache([...playtestCache, ref.current.value])
        } else if (index === 0) {
          // if the current value is the first item in the playtestCache, do nothing
          return
        } else {
          // if the current value is in the playtestCache, move up one
          ref.current.value = playtestCache[index - 1]
          props.onChange({ target: { value: playtestCache[index - 1] } })
          return
        }
      }

      ref.current.value = last
      props.onChange({ target: { value: last } })
    },
    { enableOnFormTags: ['INPUT'] },
    [props, ref, playtestCache]
  )

  // handle down arrow moving through list
  useHotkeys(
    'down',
    () => {
      if (ref.current !== document.activeElement) return
      if (playtestCache.length === 0) return

      // handle case where user is moving down more than one
      if (ref.current.value !== '') {
        const index = playtestCache.indexOf(ref.current.value)
        if (index === -1) {
          // if the current value is not in the playtestCache, add it to the playtestCache
          setPlaytestCache([...playtestCache, ref.current.value])
        } else if (index === playtestCache.length - 1) {
          // handle user moving down back into an empty input
          ref.current.value = ''
          // if the current value is the last item in the playtestCache, do nothing
          return
        } else {
          // if the current value is in the playtestCache, move down one
          ref.current.value = playtestCache[index + 1]
          props.onChange({ target: { value: playtestCache[index + 1] } })
          return
        }
      }

      ref.current.value = ''
      props.onChange({ target: { value: '' } })
    },
    { enableOnFormTags: ['INPUT'] },
    [props, ref, playtestCache]
  )

  // function to call onSend  after storing user input in playtestCache
  const onSend = () => {
    const newHistory = [...playtestCache, ref.current.value]
    setPlaytestCache(newHistory as [])
    props.onSend()
  }

  return (
    <div className={css['playtest-input']}>
      <input
        ref={ref}
        type="text"
        value={props.value}
        onChange={props.onChange}
        placeholder="Type play test input here"
      ></input>
      <Button
        className={`small ${css['playtest-input-send']}`}
        style={{ cursor: 'pointer' }}
        onClick={onSend}
      >
        Send
      </Button>
    </div>
  )
}

// Default playtest data.
const defaultPlaytestData = {
  sender: 'user',
  observer: 'assistant',
  type: 'playtest',
  client: 'playtest',
  channel: 'playtest',
  channelType: 'playtest',
  agentId: 'preview',
  entities: ['user', 'assistant'],
}

type Message = {
  sender: string
  content: string
}

/**
 * Playtest component - The main component for handling playtesting functionality.
 */
const Playtest = ({ tab }) => {
  const config = useConfig()
  const { inspectorData } = useInspector()

  const scrollbars = useRef<any>()
  const [history, setHistory] = useState<Message[]>([])

  const [value, setValue] = useState('')
  const [openData, setOpenData] = useState<boolean>(false)

  const { publish, subscribe, events } = usePubSub()
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

  const localState = useAppSelector(state => {
    return selectStateBytabId(state.localState, tab.id)
  })

  const { $PLAYTEST_PRINT, $RUN_SPELL } = events

  // Print to console callback function.
  const printToConsole = useCallback(
    (_, _text) => {
      // check if _text is a string
      if (typeof _text !== 'string') {
        console.warn('Could not split text, not a string', _text);
        return;
      }
      const text = `Agent: ` + _text;

      const newMessage: Message = {
        sender: 'agent',
        content: text,
      };

      // Use the functional update form to ensure we are always using the most up-to-date state
      setHistory((prevHistory) => [...prevHistory, newMessage]);
    },
    []
  );

  // Set playtest options based on spell graph nodes with the playtestToggle set to true.
  const [playtestOptions, setPlaytestOptions] = useState<Record<
    string,
    any
  > | null>([])
  const [playtestOption, setPlaytestOption] = useState(null)

  useEffect(() => {
    if (!inspectorData || inspectorData.name !== 'Input') return
    setPlaytestOption(
      `Input - ` +
      (inspectorData.data.inputType &&
        inspectorData.data.inputType !== 'Default'
        ? inspectorData.data.inputType
        : inspectorData.data.inputName)
    )
  }, [inspectorData])

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

    setPlaytestOptions(options)
    if (!playtestOption && options.length > 0)
      setPlaytestOption(options[0].value)
  }, [spellData])

  // Keep scrollbar at the bottom of its window.
  useEffect(() => {
    if (!scrollbars.current) return
    scrollbars.current.scrollToBottom()
  }, [history])

  useEffect(() => {
    const unsubscribe = subscribe($PLAYTEST_PRINT(tab.id), printToConsole)

    // Return a cleanup function.
    return unsubscribe as () => void
  }, [subscribe, printToConsole, $PLAYTEST_PRINT, tab.id])

  // Sync up localState into data field for persistence.
  useEffect(() => {
    // Set up a default for the local state here.
    if (!localState) {
      dispatch(
        addLocalState({
          id: tab.id,
          playtestData: JSON.stringify({
            ...defaultPlaytestData,
            projectId: config.projectId,
          }),
        })
      )
      return
    }
  }, [config.projectId, dispatch, localState, tab.id])

  // Available editor options.
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

  // Send playtest input to the system.
  const onSend = async () => {
    const newMessage: Message = {
      sender: 'user',
      content: `You: ${value}`,
    }
    const newHistory = [...history, newMessage]
    setHistory(newHistory as [])

    let toSend = value
    setValue('')

    const json = localState?.playtestData

    if (!json) {
      enqueueSnackbar('No data provided', {
        variant: 'error',
      })
      return
    }

    // Validate the JSON data.
    try {
      JSON.parse(json)
    } catch (e) {
      enqueueSnackbar('Invalid data - JSON is poorly formatted', {
        variant: 'error',
      })
      return
    }

    // Get spell from the editor.
    const graph = serialize()
    if (!graph) {
      enqueueSnackbar('No graph found', {
        variant: 'error',
      })
    }

    const playtestNode = Object.values(graph.nodes).find(node => {
      return node.data.name === playtestOption
    }) as any

    if (!playtestNode) {
      enqueueSnackbar('No input node found for this input type', {
        variant: 'error',
      })
      return
    }

    const playtestInputName = playtestNode?.data.name

    toSend = {
      connector: playtestInputName,
      content: value,
      sender: 'user',
      observer: 'assistant',
      agentId: 'preview',
      client: 'playtest',
      channel: 'previewChannel',
      projectId: config.projectId,
      channelType: 'previewChannelType',
      rawData: value,
      entities: ['user', 'assistant'],
      ...JSON.parse(json),
    }

    if (!playtestInputName) {
      enqueueSnackbar('No input node found for this input type', {
        variant: 'error',
      })
      return
    }

    const data = {
      spellName: tab.name.split('--')[0],
      id: tab.id,
      projectId: config.projectId,
      inputs: {
        [playtestInputName as string]: toSend,
      },
      publicVariables: JSON.stringify(
        Object.values(graph.nodes || {}).filter(
          (node: { data }) => node?.data?.isPublic
        )
      ),
      secrets: JSON.parse(localStorage.getItem('secrets') || '{}'),
    }

    setValue('')

    publish($RUN_SPELL(tab.id), data)
  }

  // Update state when playtest data is changed.
  const onDataChange = dataText => {
    dispatch(
      upsertLocalState({
        id: tab.id,
        playtestData: dataText ?? defaultPlaytestData,
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
        style={{ width: '100%', zIndex: 1 }}
        options={playtestOptions}
        onChange={onSelectChange}
        defaultValue={{
          value: playtestOption || null,
          label: playtestOption || 'No Inputs Found',
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

  const UserMessage = ({ message }) => (
    <div className={css['playtest-user-message']}>
      <div className={css['playtest-user-message-content']}>{message}</div>
    </div>
  )

  const AgentMessage = ({ message }) => (
    <div className={css['playtest-agent-message']}>
      <div className={css['playtest-agent-message-content']}>{message}</div>
    </div>
  )

  return (
    <Window toolbar={toolbar}>
      <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
        <div
          className={css['playtest-output']}
          style={{ display: openData ? '' : 'none' }}
        >
          <Scrollbars ref={ref => (scrollbars.current = ref)}>
            <Editor
              theme="sds-dark"
              language="json"
              value={localState?.playtestData}
              options={options}
              defaultValue={
                localState?.playtestData || JSON.stringify(defaultPlaytestData)
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
        <div className={css['playtest-output']}>
          <Scrollbars ref={ref => (scrollbars.current = ref)}>
            <ul>
              {history.map((printItem: Message, key: any) => {
                if (printItem.sender === 'user') {
                  return (
                    <li key={key}>
                      <UserMessage message={printItem.content} />
                    </li>
                  )
                } else if (printItem.sender === 'agent') {
                  return (
                    <li key={key}>
                      <AgentMessage message={printItem.content} />
                    </li>
                  )
                } else {
                  return null
                }
              })}
            </ul>
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
