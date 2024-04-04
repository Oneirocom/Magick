import {
  useGetSeraphChatHistoryQuery,
  useCreateSeraphRequestMutation,
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
  const { data: seraphChatHistory } = useGetSeraphChatHistoryQuery({ agentId })
  const [createSeraphRequest, { error: requestRecordError }] =
    useCreateSeraphRequestMutation()

  const { publish, subscribe, events } = usePubSub()
  const { $SERAPH_EVENT } = events

  // set up listeners for response, error, info,
  useEffect(() => {
    const destoryResponseListener = subscribe(
      $SERAPH_EVENT(tab.id),
      (event, data) => {
        console.log('RESPONSE', event)
        setEventData(data)
      }
    )
    return () => {
      destoryResponseListener()
    }
  }, [$SERAPH_EVENT, tab.id])

  useEffect(() => {
    if (!eventData) return
    setHistory(prevHistory => [...prevHistory, eventData])
  }, [eventData])

  // fetch seraph chat history
  useEffect(() => {
    if (
      seraphChatHistory?.length === history.length ||
      seraphChatHistory?.length === 0 ||
      !seraphChatHistory
    )
      return

    setHistory(seraphChatHistory)
  }, [seraphChatHistory])

  // function to make a request
  const makeSeraphRequest = async (request: SeraphRequest) => {
    const seraphRequest: ISeraphEvent = {
      agentId,
      projectId,
      type: SeraphEvents.request,
      spellId: tab.params.spellId,
      data: { request },
      createdAt: new Date().toISOString(),
    }
    try {
      setEventData(undefined)
      const data = await createSeraphRequest(seraphRequest)
      if (!data) throw new Error('Error creating seraph request')
      publish($SERAPH_EVENT(tab.id), { seraphRequest })
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
