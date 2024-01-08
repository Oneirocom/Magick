// DOCUMENTED
import { Button, Select, Window } from 'client/core'
import Editor from '@monaco-editor/react'
import { useSnackbar } from 'notistack'
import React, { useEffect, useRef, useState } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { useHotkeys } from 'react-hotkeys-hook'
import { useDispatch, useSelector } from 'react-redux'
import { usePubSub, useConfig } from '@magickml/providers'
import css from '../../styles/magick.module.css'
import {
  RootState,
  addLocalState,
  selectStateBytabId,
  upsertLocalState,
  useAppSelector,
  useSelectAgentsEvent,
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
const ChatWindow = ({ tab, spellId }) => {
  const config = useConfig()

  const { lastItem: lastEvent } = useSelectAgentsEvent()

  const scrollbars = useRef<any>()
  const [history, setHistory] = useState<Message[]>([])
  const [value, setValue] = useState('')
  const [openData, setOpenData] = useState<boolean>(false)
  const isStreaming = useRef(false)
  const accumulatedTextRef = useRef(""); // Ref to hold the accumulated text

  const setIsStreaming = (value) => {
    isStreaming.current = value;
  }

  const messageQueue = useRef([]); // Queue to hold incoming text chunks
  const typingInterval = useRef(null); // Ref to manage the interval

  const globalConfig = useSelector((state: RootState) => state.globalConfig)
  const { currentAgentId } = globalConfig
  const { publish, events } = usePubSub()
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()

  const localState = useAppSelector(state => {
    return selectStateBytabId(state.localState, tab.id)
  })

  const { MESSAGE_AGENT } = events

  // Print to console callback function.
  const printToConsole =
    (_text) => {
      // check if _text is a string
      if (typeof _text !== 'string')
        return console.warn('could not split text, not a string', _text)
      const text = `Agent: ` + _text

      const newMessage: Message = {
        sender: 'agent',
        content: text,
      }

      setHistory((prevHistory) => [...prevHistory, newMessage]);
    }

  const processNextChunk = () => {
    console.log('processing next chunk');
    if (messageQueue.current.length === 0) {
      accumulatedTextRef.current = "";
      setIsStreaming(false); // Mark the end of the streaming session
      return;
    }

    const nextChunk = messageQueue.current.shift();

    if (typingInterval.current) {
      clearInterval(typingInterval.current); // Clear any previous interval
    }

    let i = accumulatedTextRef.current.length; // Start from the last character of the accumulated text

    // Update the accumulated text based on the current streaming state
    if (isStreaming.current) {
      accumulatedTextRef.current += nextChunk; // Append new chunk to the accumulated text
    } else {
      accumulatedTextRef.current = nextChunk; // Start fresh for a new message
    }

    setIsStreaming(true);

    typingInterval.current = setInterval(() => {
      const internalI = i
      setHistory(prevHistory => {
        const newHistory = [...prevHistory];
        const lastMessageIndex = newHistory.length - 1;
        const lastMessage = newHistory[lastMessageIndex];

        if (lastMessage.sender === 'agent') {
          newHistory[lastMessageIndex] = {
            ...newHistory[lastMessageIndex],
            content: accumulatedTextRef.current.slice(0, internalI + 1),
          };
        } else {
          newHistory.push({
            sender: 'agent',
            content: "Agent:",
          });
        }

        return newHistory;
      });

      i++

      // Move to the next chunk only after the current one is fully displayed
      if (internalI >= accumulatedTextRef.current.length - 1) { // -1 because we want to wait until the last character is processed
        clearInterval(typingInterval.current);
        typingInterval.current = null;

        // Now check if there are more chunks to process
        if (messageQueue.current.length > 0) {
          processNextChunk(); // Move to the next chunk if available
        } else {
          setIsStreaming(false); // Mark the end of the streaming session
        }
      }
    }, 20);
  };

  const streamToConsole = (_text) => {
    if (typeof _text !== 'string') {
      console.warn('Could not stream text, not a string', _text);
      return;
    }

    // Add new text to the queue
    messageQueue.current.push(_text);
    if (!isStreaming.current) {
      // If not currently streaming, start processing
      setIsStreaming(false)
      processNextChunk();
    }
  };


  // note here that we can do better than this by using things like a sessionId, etc.
  useEffect(() => {
    if (!lastEvent) return

    const { data, event, actionName } = lastEvent
    const { content } = data


    if (event?.runInfo?.spellId !== spellId) return
    if (event.channel !== spellId) return

    if (actionName === 'sendMessage') {
      printToConsole(content)
    }

    if (actionName === 'streamMessage') {
      streamToConsole(content)
    }
  }, [lastEvent])

  // Set playtest options based on spell graph nodes with the playtestToggle set to true.
  const [playtestOptions] = useState<Record<
    string,
    any
  > | null>([])
  const [playtestOption, setPlaytestOption] = useState(null)

  // Keep scrollbar at the bottom of its window.
  useEffect(() => {
    if (!scrollbars.current) return
    scrollbars.current.scrollToBottom()
  }, [history])

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
    setValue('')

    // make sure when a user sends a message, we stop streaming mode from the agent
    setIsStreaming(false)

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

    const eventPayload = {
      content: value,
      sender: 'user',
      observer: 'assistant',
      client: 'cloud.magickml.com',
      channel: spellId,
      projectId: config.projectId,
      channelType: 'spell playtest',
      rawData: value,
      agentId: currentAgentId
    }

    // const data = {
    //   spellName: tab.name,
    //   id: spellId,
    //   projectId: config.projectId,
    //   inputs: {
    //     [playtestInputName as string]: toSend,
    //   },
    //   publicVariables: '{}',
    //   version: 'v2',
    //   secrets: JSON.parse(localStorage.getItem('secrets') || '{}'),
    // }

    setValue('')
    publish(MESSAGE_AGENT, eventPayload)
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

export default ChatWindow
