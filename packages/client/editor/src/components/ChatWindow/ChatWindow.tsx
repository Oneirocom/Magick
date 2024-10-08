'use client'

import React, { useEffect, useState } from 'react'
import { Window } from 'client/core'
import Editor, { Monaco } from '@monaco-editor/react'
import { useSnackbar } from 'notistack'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { Tab, useConfig, usePubSub } from '@magickml/providers'
import {
  RootState,
  setActiveInput,
  useGetSpellByNameQuery,
  useSelectAgentsEvent,
} from 'client/state'
import { SEND_MESSAGE, STREAM_MESSAGE } from '@magickml/agent-communication'
import { ChatInput } from './ChatInput'
import { Button, Checkbox, Label } from '@magickml/client-ui'
import posthog from 'posthog-js'
import { Message, useMessageHistory } from '../../hooks/useMessageHistory'
import { useMessageQueue } from '../../hooks/useMessageQueue'
import { usePlaytestData } from '../../hooks/usePlaytestData'
import { useDispatch, useSelector } from 'react-redux'
import { useMarkdownProcessor } from 'chat-window'
import useEditorSession from '../../hooks/useEditorSession'

type Props = {
  tab: Tab
  spellName: string
}

const ChatWindow = ({ tab, spellName }: Props) => {
  const config = useConfig()
  const { enqueueSnackbar } = useSnackbar()
  const { spell } = useGetSpellByNameQuery(
    { spellName },
    {
      skip: !spellName,
      selectFromResult: ({ data }) => ({ spell: data?.data[0] }),
    }
  )

  const { lastItem: lastEvent } = useSelectAgentsEvent()
  const [value, setValue] = useState('')
  const [openData, setOpenData] = useState<boolean>(false)
  const [userScrolled, setUserScrolled] = useState<boolean>(false)
  const globalConfig = useSelector((state: RootState) => state.globalConfig)
  const { currentAgentId, engineRunning } = globalConfig
  const { publish, events } = usePubSub()
  const editorSession = useEditorSession()
  const dispatch = useDispatch()
  const readOnly = !engineRunning

  const {
    history,
    scrollbars,
    autoscroll,
    setAutoscroll,
    printToConsole,
    onClear,
    setHistory,
    handleScroll,
  } = useMessageHistory({ userScrolled, setUserScrolled })

  const { streamToConsole } = useMessageQueue({
    setHistory,
  })

  const MESSAGE_AGENT = events.MESSAGE_AGENT

  const { localState, onDataChange } = usePlaytestData(tab.id)

  // React to new events
  useEffect(() => {
    if (!lastEvent || !spell?.id) return

    const { data, event, actionName } = lastEvent
    const { content } = data

    if (event?.runInfo?.spellId !== spell.id) return

    if (actionName === SEND_MESSAGE) {
      printToConsole(content)
    } else if (actionName === STREAM_MESSAGE) {
      streamToConsole(content)
    }
  }, [lastEvent])

  // Handle message sending
  const onSend = async () => {
    const newMessage = {
      sender: 'user',
      content: `You: ${value}`,
    }

    const newHistory = [...history, newMessage]
    setHistory(newHistory)

    if (!localState?.playtestData) {
      enqueueSnackbar('No data provided', {
        variant: 'error',
      })
      return
    }

    try {
      JSON.parse(localState.playtestData)
    } catch (e) {
      enqueueSnackbar('Invalid data - JSON is poorly formatted', {
        variant: 'error',
      })
      return
    }

    const data = JSON.parse(localState.playtestData)

    const eventPayload = {
      content: value,
      sender: data.sender || 'user',
      observer: data.observer || 'assistant',
      client: 'editor',
      channel: editorSession,
      projectId: config.projectId,
      channelType: 'spell playtest',
      rawData: value,
      agentId: currentAgentId,
      spellId: spell.id,
      isPlaytest: true,
    }

    publish(MESSAGE_AGENT, eventPayload)
    setValue('')

    posthog.capture('playtest_message_sent', {
      projectId: config.projectId,
      spellId: spell.id,
      agentId: currentAgentId,
    })
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const toggleData = () => {
    setOpenData(!openData)
  }

  const toolbar = (
    <div className="inline-flex space-x-1 justify-right items-center mt-1.5 mb-1.5 pl-1 pr-2">
      <Button
        variant="basic"
        onClick={toggleData}
        className="h-6 w-14 font-medium"
      >
        Data
      </Button>
      <Button
        variant="basic"
        onClick={onClear}
        className="h-6 w-14 font-medium"
      >
        Clear
      </Button>
      <Label className="font-medium text-xs">Autoscroll</Label>
      <Checkbox
        className=""
        onCheckedChange={() => setAutoscroll(!autoscroll)}
        defaultChecked={autoscroll}
      />
    </div>
  )

  const UserMessage = ({ message }: { message: any }) => {
    const content = useMarkdownProcessor(message) as JSX.Element
    return (
      <div className="flex flex-row mb-2">
        <div className="bg-transparent p-2 rounded text-white flex-1 text-sm font-mono whitespace-pre-line">
          {content}
        </div>
      </div>
    )
  }

  const AgentMessage = ({ message }: { message: any }) => {
    const content = useMarkdownProcessor(message) as JSX.Element
    return (
      <div className="flex flex-row mb-2">
        <div className="bg-[var(--foreground-color)] p-2 rounded text-white flex-1 text-sm font-mono whitespace-pre-line">
          {content}
        </div>
      </div>
    )
  }

  return (
    <Window toolbar={toolbar}>
      <>
        <div
          className="relative flex flex-col h-full bg-[var(--background-color-light)] w-[96%] m-auto justify-center"
          onClick={() => dispatch(setActiveInput(null))}
        >
          {/* Data editor section */}
          <div className={`${openData ? 'block' : 'hidden'} flex-1`}>
            <Scrollbars ref={scrollbars} onScroll={handleScroll}>
              {/* Feedback overlay */}

              <Editor
                theme="sds-dark"
                language="json"
                value={localState?.playtestData}
                options={{
                  minimap: { enabled: false },
                  wordWrap: 'bounded',
                  fontSize: 14,
                  readOnly: readOnly,
                }}
                defaultValue={
                  localState?.playtestData ||
                  JSON.stringify({ sender: 'user', observer: 'assistant' })
                }
                onChange={onDataChange}
                beforeMount={handleEditorWillMount}
              />
            </Scrollbars>
          </div>
          <div
            className={`${openData ? 'block' : 'hidden'} h-6 bg-gray-700`}
          ></div>

          {/* Chat history section */}
          {readOnly && (
            <div className="relative inset-0 flex flex-col items-center justify-center z-50 h-full">
              <div className="text-white text-lg">Read-Only Mode</div>
              <div className="text-white text-md mt-2">
                Run your spell to test your Agent
              </div>
            </div>
          )}
          <div className="flex-1 overflow-hidden bg-[var(--background-color)] relative">
            <Scrollbars ref={scrollbars} onScroll={handleScroll}>
              <ul className="list-none m-0 p-2">
                {history.map((message: Message, index) => {
                  if (message.sender === 'user') {
                    return (
                      <li key={index}>
                        <UserMessage message={message.content} />
                      </li>
                    )
                  } else if (message.sender === 'agent') {
                    return (
                      <li key={index}>
                        <AgentMessage message={message.content} />
                      </li>
                    )
                  } else {
                    return null
                  }
                })}
              </ul>
            </Scrollbars>
          </div>

          {/* Input section */}
          <ChatInput onChange={onChange} value={value} onSend={onSend} />
        </div>
      </>
    </Window>
  )
}

export default ChatWindow

// Helper function to set Monaco Editor theme
const handleEditorWillMount = (monaco: Monaco) => {
  monaco.editor.defineTheme('sds-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#272727',
    },
  })
}
