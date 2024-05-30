// @ts-nocheck
import React, { useEffect, useState } from 'react'
import { Window } from 'client/core'
import { useSnackbar } from 'notistack'
import { v4 as uuidv4 } from 'uuid'
import {
  RootState,
  useCreateAgentSeraphEventMutation,
  useDeleteAgentSeraphEventMutation,
  useGetAgentSeraphEventsQuery,
  useGetSpellByNameQuery,
  useSelectAgentsSeraphEvent,
} from 'client/state'
import posthog from 'posthog-js'

import { useSelector } from 'react-redux'
import { SeraphChatInput } from './SeraphChatInput'
import { SeraphChatHistory } from './SeraphChatHistory'
import { Message, useMessageHistory } from '../../hooks/useMessageHistory'
import { useMessageQueue } from '../../hooks/useMessageQueue'
import { ISeraphEvent, SeraphEvents, SeraphRequest } from 'servicesShared'
import SeraphTopBar from './SeraphTopBar'

const SeraphChatWindow = props => {
  const [value, setValue] = useState('')
  const [seraphEventData, setSeraphEventData] = useState<
    Record<SeraphEvents, any>
  >({} as Record<SeraphEvents, any>)
  const [initialHistorySet, setInitialHistory] = useState<boolean>(false)

  const { enqueueSnackbar } = useSnackbar()
  const { tab } = props
  const spellName = tab.params.spellName

  const { lastItem: lastEvent } = useSelectAgentsSeraphEvent()
  const [createSeraphRequest] = useCreateAgentSeraphEventMutation()

  const { spell } = useGetSpellByNameQuery(
    { spellName },
    {
      skip: !spellName,
      selectFromResult: ({ data }) => ({ spell: data?.data[0] }),
    }
  )

  const globalConfig = useSelector((state: RootState) => state.globalConfig)
  const { currentAgentId } = globalConfig

  const { data: seraphChatHistory } = useGetAgentSeraphEventsQuery({
    agentId: currentAgentId,
  })

  const { history, scrollbars, printToConsole, setHistory } = useMessageHistory(
    { seraph: true }
  )
  const [deleteSeraphEvent] = useDeleteAgentSeraphEventMutation()

  const { streamToConsole } = useMessageQueue({ setHistory, seraph: true })

  const makeSeraphRequest = async (request: SeraphRequest) => {
    if (!currentAgentId || !spell) return
    const newRequest: ISeraphEvent = {
      id: uuidv4(),
      agentId: currentAgentId,
      projectId: spell.projectId,
      type: SeraphEvents.request,
      spellId: tab.params.spellId,
      data: { request },
      createdAt: new Date().toISOString(),
    }
    const data = await createSeraphRequest(newRequest)
    if (!data) {
      enqueueSnackbar('Error sending message', { variant: 'error' })
    }
  }

  useEffect(() => {
    if (seraphChatHistory?.length && !initialHistorySet) {
      const formattedHistory = seraphChatHistory.map((event: ISeraphEvent) => {
        const isMessage = event.type === SeraphEvents.message
        return {
          sender: isMessage ? 'assistant' : 'user',
          content: isMessage ? event.data.message : event.data.request?.message,
          id: event.id,
        } as Message
      })

      const filteredHistory = formattedHistory.reduce((acc, curr, index) => {
        const prevMessage = acc[acc.length - 1]

        if (prevMessage?.sender !== curr.sender) {
          acc.push(curr)
        } else {
          // If the current message has the same sender as the previous one
          if (curr.sender === 'user') {
            // If both messages are from the user, remove the current message
            void deleteSeraphEvent({
              seraphEventId: curr.id || '',
            })
          } else {
            // If both messages are from the assistant, remove the previous message from the server and skip the current one
            void deleteSeraphEvent({
              seraphEventId: prevMessage.id || '',
            })
            acc[acc.length - 1] = curr
          }
        }

        return acc
      }, [] as Message[])

      // Ensure the last item in the history is from the assistant
      if (filteredHistory.length > 0) {
        const lastMessage = filteredHistory[filteredHistory.length - 1]
        if (lastMessage.sender === 'user') {
          void deleteSeraphEvent({
            seraphEventId: lastMessage.id || '',
          })
          filteredHistory.pop()
        }
      }

      setHistory(filteredHistory)
      setInitialHistory(true)
    } else if (seraphChatHistory?.length && initialHistorySet) {
      const formattedHistory = seraphChatHistory.map((event: ISeraphEvent) => {
        const isMessage = event.type === SeraphEvents.message
        return {
          sender: isMessage ? 'assistant' : 'user',
          content: isMessage ? event.data.message : event.data.request?.message,
          id: event.id,
        } as Message
      })

      setHistory(formattedHistory)
    }
  }, [
    seraphChatHistory,
    setHistory,
    deleteSeraphEvent,
    initialHistorySet,
    setInitialHistory,
  ])

  useEffect(() => {
    const lastEventData = lastEvent?.data.data
    if (!lastEventData) return
    const seraphEvent = lastEvent.data as ISeraphEvent
    if (!seraphEvent) return

    const handleEvent = (
      message: string | undefined,
      variant: 'info' | 'error' = 'info'
    ) => {
      if (variant === 'error') {
        enqueueSnackbar(message, { variant })
      }
      printToConsole(message || '')
    }

    const eventHandlers: Record<SeraphEvents, () => void> = {
      [SeraphEvents.request]: () => {},
      [SeraphEvents.message]: () => {},
      [SeraphEvents.error]: () => {
        handleEvent(seraphEvent.data.error, 'error')
        setSeraphEventData(prev => ({
          ...prev,
          [SeraphEvents.error]: seraphEvent.data.error,
        }))
      },
      [SeraphEvents.functionResult]: () =>
        setSeraphEventData(prev => ({
          ...prev,
          [SeraphEvents.functionResult]: seraphEvent.data.functionResult,
        })),
      [SeraphEvents.functionExecution]: () =>
        setSeraphEventData(prev => ({
          ...prev,
          [SeraphEvents.functionExecution]: seraphEvent.data.functionExecution,
        })),
      [SeraphEvents.info]: () => {
        handleEvent(seraphEvent.data.info)
        setSeraphEventData(prev => ({
          ...prev,
          [SeraphEvents.info]: seraphEvent.data.info,
        }))
      },
      [SeraphEvents.middlewareExecution]: () =>
        setSeraphEventData(prev => ({
          ...prev,
          [SeraphEvents.middlewareExecution]:
            seraphEvent.data.middlewareExecution,
        })),
      [SeraphEvents.middlewareResult]: () =>
        setSeraphEventData(prev => ({
          ...prev,
          [SeraphEvents.middlewareResult]: seraphEvent.data.middlewareResult,
        })),
      [SeraphEvents.token]: () => streamToConsole(seraphEvent.data.token || ''),
    }

    eventHandlers[seraphEvent.type]?.()

    if (lastEventData.request) {
      printToConsole(lastEventData.request.message)
    }
  }, [lastEvent])

  const onSend = async () => {
    if (!value || !currentAgentId || !spell) return
    try {
      const newMessage: Message = {
        sender: 'user',
        content: value,
      }

      const eventPayload: SeraphRequest = {
        message: value,
      }
      const lastEvent = history[history.length - 1]

      if (lastEvent?.sender === 'user') {
        const newHistory = [...history]
        newHistory.pop()
        await deleteSeraphEvent({
          seraphEventId: lastEvent.id || '',
        })
        if (newHistory) setHistory(newHistory)
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

  const resubmitRequest = () => {
    if (!lastEvent) return

    const seraphRequest = lastEvent.data.request
    if (!seraphRequest) return

    void makeSeraphRequest(seraphRequest)
  }

  return (
    <div className="flex-grow border-0 justify-between rounded bg:[--deep-background-color]">
      <Window>
        <SeraphTopBar
          clearHistory={() => setHistory([])}
          requestError={seraphEventData.error}
          resubmitRequest={resubmitRequest}
        />
        <div className="flex flex-col h-full bg-[--ds-black] w-[96%] m-auto">
          <SeraphChatHistory
            history={history}
            scrollbars={scrollbars}
            seraphEventData={seraphEventData}
            setSeraphEventData={setSeraphEventData}
            // resubmitRequest={resubmitRequest}
          />
          <SeraphChatInput onChange={onChange} value={value} onSend={onSend} />
        </div>
      </Window>
    </div>
  )
}

export default SeraphChatWindow
