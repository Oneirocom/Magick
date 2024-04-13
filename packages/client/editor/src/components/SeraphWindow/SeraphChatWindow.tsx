import React, { useEffect, useState } from 'react'
import { Window } from 'client/core'
import { useSnackbar } from 'notistack'

// import { useConfig } from '@magickml/providers'
import {
  RootState,
  useGetSpellByNameQuery,
  useSelectAgentsSeraphEvent,
} from 'client/state'
import posthog from 'posthog-js'

import { useSelector } from 'react-redux'
import { SeraphChatInput } from './SeraphChatInput'
import { SeraphChatHistory } from './SeraphChatHistory'
import { useSeraph } from '../../hooks/useSeraph'
import { useMessageHistory } from '../../hooks/useMessageHistory'
import { useMessageQueue } from '../../hooks/useMessageQueue'
import { ISeraphEvent, SeraphEvents, SeraphRequest } from 'servicesShared'

const SeraphChatWindow = props => {
  const [value, setValue] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [functionEventData, setFunctionEventData] = useState<ISeraphEvent>()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [middlewareEventData, setMiddlewareEventData] = useState<ISeraphEvent>()

  const { enqueueSnackbar } = useSnackbar()

  // const config = useConfig()

  const { tab } = props

  const spellName = tab.params.spellName

  const { lastItem: lastEvent } = useSelectAgentsSeraphEvent()

  const { spell } = useGetSpellByNameQuery(
    { spellName },
    {
      skip: !spellName,
      selectFromResult: ({ data }) => ({ spell: data?.data[0] }),
    }
  )

  const globalConfig = useSelector((state: RootState) => state.globalConfig)

  const { currentAgentId } = globalConfig

  const {
    history,
    scrollbars,
    printToConsole,
    setHistory,
    // setAutoscroll,
    // autoscroll,
  } = useMessageHistory()

  const { streamToConsole } = useMessageQueue({ setHistory })

  const { makeSeraphRequest } = useSeraph({
    tab,
    projectId: spell?.projectId,
    agentId: currentAgentId,
    history,
    setHistory,
  })

  // React to new events
  useEffect(() => {
    // Early return if lastEvent or spell.id is not defined
    if (!lastEvent?.data?.data.message) return

    const seraphEvent = lastEvent.data as ISeraphEvent
    console.log('SERAPH MESSAGE RECEIVED', seraphEvent)

    // Handling common actions in a function to reduce code repetition
    const handleEvent = (
      message: string | undefined,
      variant: 'info' | 'error' = 'info'
    ) => {
      if (variant === 'error') {
        enqueueSnackbar(message, { variant })
      }
      printToConsole(message || '')
    }

    // Using an object to map event types to their specific actions
    const eventActions = {
      [SeraphEvents.message]: () => handleEvent(seraphEvent.data.message),
      [SeraphEvents.error]: () => handleEvent(seraphEvent.data.error, 'error'),
      [SeraphEvents.functionResult]: () => setFunctionEventData(seraphEvent),
      [SeraphEvents.functionExecution]: () => setFunctionEventData(seraphEvent),
      [SeraphEvents.info]: () => handleEvent(seraphEvent.data.info),
      [SeraphEvents.middlewareExecution]: () =>
        setMiddlewareEventData(seraphEvent),
      [SeraphEvents.middlewareResult]: () =>
        setMiddlewareEventData(seraphEvent),
      [SeraphEvents.token]: () => streamToConsole(seraphEvent.data.token || ''),
    }

    // Execute the action if the event type matches
    eventActions[seraphEvent.type]?.()

    streamToConsole(lastEvent.data.content)
  }, [lastEvent])

  // Handle message sending
  const onSend = async () => {
    if (!value || !currentAgentId || !spell) return
    try {
      const newMessage = {
        sender: 'user',
        content: `You: ${value}`,
      }

      const eventPayload: SeraphRequest = {
        message: value,
      }

      const success = makeSeraphRequest(eventPayload)
      if (!success) return

      const newHistory = [...history, newMessage]
      setHistory(newHistory)
      setValue('')

      posthog.capture('seraph_request_sent', {
        spellId: spell.id,
        projectId: spell.projectId,
        agentId: currentAgentId,
      })
    } catch (error) {
      console.error('Error sending message', error)
    }
  }

  const onChange = e => {
    setValue(e.target.value)
  }

  return (
    <div className="flex-grow border-0 justify-between rounded bg:[--deep-background-color]">
      <Window>
        <div className="flex flex-col h-full bg-[--ds-black] w-[96%] m-auto">
          <SeraphChatHistory history={history} scrollbars={scrollbars} />
          <SeraphChatInput onChange={onChange} value={value} onSend={onSend} />
        </div>
      </Window>
    </div>
  )
}

export default SeraphChatWindow
