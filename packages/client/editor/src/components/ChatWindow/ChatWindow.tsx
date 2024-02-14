// DOCUMENTED
import { Window } from 'client/core'
import Editor from '@monaco-editor/react'
import { useSnackbar } from 'notistack'
import React, { useEffect, useRef, useState } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'

import { useDispatch, useSelector } from 'react-redux'
import { usePubSub, useConfig } from '@magickml/providers'
// import css from './magick.module.css'
import {
  RootState,
  addLocalState,
  selectStateBytabId,
  upsertLocalState,
  useAppSelector,
  useGetSpellByNameQuery,
  useSelectAgentsEvent,
} from 'client/state'
import { SEND_MESSAGE, STREAM_MESSAGE } from 'communication'
// import { Checkbox, FormControlLabel } from '@mui/material'
import { ChatInput } from './ChatInput'
import { Button, Checkbox, Label } from '@magickml/client-ui'

// Default playtest data.
const defaultPlaytestData = {
  sender: 'user',
  observer: 'assistant',
}

type Message = {
  sender: string
  content: string
}

/**
 * Playtest component - The main component for handling playtesting functionality.
 */
const ChatWindow = ({ tab, spellName }) => {
  const config = useConfig()

  const { spell } = useGetSpellByNameQuery(
    { spellName },
    {
      skip: !spellName,
      selectFromResult: data => ({
        spell: data?.data?.data[0],
      }),
    }
  )

  const { lastItem: lastEvent } = useSelectAgentsEvent()

  const scrollbars = useRef<any>()
  const [history, setHistory] = useState<Message[]>([])
  const [value, setValue] = useState('')
  const [openData, setOpenData] = useState<boolean>(false)
  const [autoscroll, setAutoscroll] = useState<boolean>(true)
  const isStreaming = useRef(false)
  const messageQueue = useRef<string[]>([])
  const typingTimer = useRef<any>(null)
  const queueTimer = useRef<any>(null)

  const setIsStreaming = value => {
    isStreaming.current = value
  }

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
  const printToConsole = (_text: string) => {
    if (typeof _text !== 'string')
      return console.warn('could not split text, not a string', _text)
    const text = `Agent: ${_text}`

    const newMessage: Message = {
      sender: 'agent',
      content: text,
    }

    setHistory(prevHistory => [...prevHistory, newMessage])
  }

  const typeChunk = () => {
    // Process all messages in the queue at once
    const messagesToProcess = [...messageQueue.current]
    messageQueue.current = [] // Clear the queue as we're processing all messages

    setHistory(prevHistory => {
      const newHistory = [...prevHistory]
      messagesToProcess.forEach(currentMessage => {
        if (
          newHistory.length === 0 ||
          newHistory[newHistory.length - 1].sender !== 'agent'
        ) {
          newHistory.push({ sender: 'agent', content: currentMessage })
        } else {
          newHistory[newHistory.length - 1].content += currentMessage
        }
      })
      return newHistory
    })
  }

  const processQueue = () => {
    if (messageQueue.current.length > 0) {
      typeChunk() // Directly call typeChunk to process all messages
    }
  }

  const streamToConsole = _text => {
    if (typeof _text !== 'string') {
      console.warn('Could not stream text, not a string', _text)
      return
    }

    messageQueue.current.push(_text)
    processQueue()
  }

  useEffect(() => {
    queueTimer.current = setInterval(processQueue, 100) as unknown as null
    return () => {
      if (queueTimer.current)
        clearInterval(queueTimer.current as unknown as number)
      if (typingTimer.current)
        clearInterval(typingTimer.current as unknown as number)
    }
  }, [])

  // note here that we can do better than this by using things like a sessionId, etc.
  useEffect(() => {
    if (!lastEvent || !spell?.id) return

    const { data, event, actionName } = lastEvent
    const { content } = data

    if (event?.runInfo?.spellId !== spell.id) return
    if (event.channel !== spell.id) return

    if (actionName === SEND_MESSAGE) {
      console.log('MESSAGE RECEIVED', content)
      printToConsole(content)
    }

    if (actionName === STREAM_MESSAGE) {
      streamToConsole(content)
    }
  }, [lastEvent])

  // Keep scrollbar at the bottom of its window.
  useEffect(() => {
    if (!scrollbars.current) return
    if (!autoscroll) return
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

    const data = JSON.parse(json)

    const eventPayload = {
      content: value,
      sender: data.sender || 'user',
      observer: data.observer || 'assistant',
      client: 'cloud.magickml.com',
      channel: spell.id,
      projectId: config.projectId,
      channelType: 'spell playtest',
      rawData: value,
      agentId: currentAgentId,
      spellId: spell.id,
      isPlaytest: true,
    }

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

  // const onSelectChange = async ({ value }) => {
  //   setPlaytestOption(value)
  // }

  const toolbar = (
    <div className="flex space-x-1 justify-center items-center m-auto mt-1.5 mb-1.5 pl-1 pr-0.5">
      <div className="flex space-x-1 items-center mr-1">
        <Label className="font-medium text-xs">Autoscroll</Label>
        <Checkbox
          className=""
          onCheckedChange={() => {
            setAutoscroll(!autoscroll)
          }}
          defaultChecked
        />
      </div>
      <Button
        variant="basic"
        onClick={onClear}
        className="h-6 w-14 font-medium"
      >
        Clear
      </Button>
      <Button
        variant="basic"
        onClick={toggleData}
        className="h-6 w-14 font-medium"
      >
        Data
      </Button>
    </div>
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
    <div className="flex flex-row mb-2">
      <div className="bg-transparent p-2 rounded text-white flex-1 text-sm font-mono whitespace-pre-line">
        {message}
      </div>
    </div>
  )

  const AgentMessage = ({ message }) => (
    <div className="flex flex-row mb-2">
      <div className="bg-slate-700 p-2 rounded text-white flex-1 text-sm font-mono whitespace-pre-line">
        {message}
      </div>
    </div>
  )

  return (
    <Window toolbar={toolbar}>
      <div className="flex flex-col h-full bg-[var(--background-color-light)] w-[96%] m-auto">
        <div className={`${openData ? 'block' : 'hidden'} flex-1`}>
          <Scrollbars>
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
          className={`${openData ? 'block' : 'hidden'} h-6 bg-gray-700`}
        ></div>
        <div className="flex-1 overflow-hidden bg-[var(--background-color)]">
          <Scrollbars>
            <ul className="list-none m-0 p-0">
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
        <ChatInput onChange={onChange} value={value} onSend={onSend} />
      </div>
    </Window>
  )
}

export default ChatWindow
