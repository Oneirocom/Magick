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

const SeraphChatWindow = props => {
  const [value, setValue] = useState('')
  const [seraphEventData, setSeraphEventData] = useState<
    Record<SeraphEvents, any>
  >({} as Record<SeraphEvents, any>)

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
    if (seraphChatHistory?.length) {
      const formattedHistory = seraphChatHistory.map((event: ISeraphEvent) => {
        const isMessage = event.type === SeraphEvents.message
        return {
          sender: isMessage ? 'assistant' : 'user',
          content: isMessage ? event.data.message : event.data.request?.message,
          id: event.id,
        } as Message
      })
      //check if the last message is from the user and remove it if so
      const lastMessage = formattedHistory[formattedHistory.length - 1]
      if (lastMessage.sender === 'user') {
        formattedHistory.pop()

        void deleteSeraphEvent({
          seraphEventId: lastMessage.id || '',
        })
      }
      setHistory(formattedHistory)
    }
  }, [seraphChatHistory, setHistory])

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
          <SeraphChatHistory
            history={history}
            scrollbars={scrollbars}
            seraphEventData={seraphEventData}
            setSeraphEventData={setSeraphEventData}
          />
          <SeraphChatInput onChange={onChange} value={value} onSend={onSend} />
        </div>
      </Window>
    </div>
  )
}

export default SeraphChatWindow
