import {
  useCreateAgentSeraphEventMutation,
  useGetAgentSeraphEventsQuery,
} from 'client/state'
import { useFeathers } from '@magickml/providers'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import {
  ISeraphEvent,
  SeraphEvents,
  SeraphRequest,
} from '../../../../shared/servicesShared/src'
import { Message } from './useMessageHistory'

export const useSeraph = ({ tab, projectId, agentId, history, setHistory }) => {
  const { client } = useFeathers()
  const [eventData, setEventData] = useState<ISeraphEvent>()

  const {
    data: seraphChatHistory,
    error,
    isLoading,
  } = useGetAgentSeraphEventsQuery({ agentId })

  const [createSeraphRequest, { error: requestRecordError }] =
    useCreateAgentSeraphEventMutation()

  // set up listeners for response, error, info,
  useEffect(() => {
    if (!client) return

    client
      .service('agents')
      .on('seraphEvent', (data: { data: ISeraphEvent }) => {
        const { data: eventData } = data
        setEventData(eventData)
      })
  }, [client])

  useEffect(() => {
    if (eventData === undefined) return
    if (eventData.type === SeraphEvents.token || !eventData.data.message) return

    const newMessage: Message = {
      sender: 'assistant',
      content: eventData.data.message || '',
    }
    setHistory(prevHistory => [...prevHistory, newMessage] as Message[])
  }, [eventData])

  // fetch seraph chat history
  useEffect(() => {
    if (
      seraphChatHistory?.length === history.length ||
      seraphChatHistory?.length === 0 ||
      !seraphChatHistory ||
      isLoading ||
      error
    )
      return
    const newMessages = seraphChatHistory
      .filter(
        event =>
          event.type === SeraphEvents.message ||
          event.type === SeraphEvents.request
      )
      .map((event: ISeraphEvent) => {
        const isMessage = event.type === SeraphEvents.message
        return {
          sender: isMessage ? 'assistant' : 'user',
          content: isMessage ? event.data.message : event.data.request?.message,
        }
      })
    setHistory(newMessages)
  }, [seraphChatHistory])

  // function to make a request
  const makeSeraphRequest = async (request: SeraphRequest) => {
    try {
      const seraphRequest: ISeraphEvent = {
        id: uuidv4(),
        agentId,
        projectId,
        type: SeraphEvents.request,
        spellId: tab.params.spellId,
        data: { request },
        createdAt: new Date().toISOString(),
      }
      setEventData(undefined)
      const data = await createSeraphRequest(seraphRequest)
      if (!data) throw new Error('Error creating seraph request')
      return true
    } catch (error) {
      console.error('Error making seraph request', error)
    }
  }

  const seraphError = eventData?.data?.error

  return {
    error: seraphError || requestRecordError,
    eventData,
    setEventData,
    makeSeraphRequest,
  }
}
