import {
  useCreateAgentSeraphEventMutation,
  useGetAgentSeraphEventsQuery,
} from 'client/state'
import { usePubSub } from '@magickml/providers'
import { useEffect, useState } from 'react'
import {
  ISeraphEvent,
  SeraphEvents,
  SeraphRequest,
} from '../../../../shared/servicesShared/src'

export const useSeraph = ({ tab, projectId, agentId, history, setHistory }) => {
  const [eventData, setEventData] = useState<ISeraphEvent>()

  const {
    data: seraphChatHistory,
    error,
    isLoading,
  } = useGetAgentSeraphEventsQuery({ agentId })

  const [createSeraphRequest, { error: requestRecordError }] =
    useCreateAgentSeraphEventMutation()

  const { subscribe, events } = usePubSub()

  // set up listeners for response, error, info,
  useEffect(() => {
    const destoryResponseListener = subscribe(
      events.$SERAPH_EVENT(tab.id),
      (event, data) => {
        console.log('Seraph Event Received', { event, data })
        setEventData(data)
      }
    )
    return () => {
      destoryResponseListener()
    }
  }, [])

  useEffect(() => {
    if (!eventData) return
    setHistory(prevHistory => [...prevHistory, eventData])
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

    setHistory(seraphChatHistory)
  }, [seraphChatHistory])

  // function to make a request
  const makeSeraphRequest = async (request: SeraphRequest) => {
    try {
      const seraphRequest: ISeraphEvent = {
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
