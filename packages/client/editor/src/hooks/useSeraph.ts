import {
  useGetSeraphChatHistoryQuery,
  useCreateSeraphRequestMutation,
} from 'client/state'
import { usePubSub } from '@magickml/providers'
import { useEffect, useState } from 'react'
import {
  ISeraphEvent,
  SeraphEvents,
} from '../../../../shared/servicesShared/src'

export const useSeraph = ({ tab, spellName, projectId, agentId }) => {
  const { data: seraphChatHistory } = useGetSeraphChatHistoryQuery({ agentId })
  const [createSeraphRequest, { error: requestError }] =
    useCreateSeraphRequestMutation()

  const { publish, subscribe, events } = usePubSub()
  const { $SERAPH_REQUEST, $SERAPH_RESPONSE, $SERAPH_ERROR, $SERAPH_INFO } =
    events

  const [chatHistory, setChatHistory] = useState<ISeraphEvent[]>([])
  const [info, setInfo] = useState<string | undefined>()
  const [error, setError] = useState<string | undefined>()
  const [response, setResponse] = useState<ISeraphEvent>()

  // set up listeners for response, error, info,
  useEffect(() => {
    const destoryResponseListener = subscribe(
      $SERAPH_RESPONSE(tab.id),
      (event, data) => {
        console.log('RESPONSE', event)
        setResponse(data.response)
      }
    )
    const destroyErrorListener = subscribe(
      $SERAPH_ERROR(tab.id),
      (event, data) => {
        console.log('ERROR', event)
        setError(data.error)
      }
    )
    const destroyInfoListener = subscribe(
      $SERAPH_INFO(tab.id),
      (event, data) => {
        console.log('INFO', event)
        setInfo(data.info)
      }
    )

    return () => {
      destoryResponseListener()
      destroyErrorListener()
      destroyInfoListener()
    }
  }, [$SERAPH_RESPONSE, $SERAPH_ERROR, $SERAPH_INFO])

  // fetch seraph chat history
  useEffect(() => {
    if (seraphChatHistory?.length === chatHistory.length) return
    if (seraphChatHistory?.length === 0) return
    if (!seraphChatHistory) return
    setChatHistory(seraphChatHistory)
  }, [seraphChatHistory])

  // function to make a request
  const makeSeraphRequest = async (message: string, systemPrompt: string) => {
    const seraphRequest: ISeraphEvent = {
      agentId,
      projectId,
      type: SeraphEvents.request,
      request: {
        message,
        systemPrompt,
      },
      createdAt: new Date().toISOString(),
    }
    try {
      const data = await createSeraphRequest(seraphRequest)
      if (!data) throw new Error('Error creating seraph request')
      publish($SERAPH_REQUEST(tab.id), { request: seraphRequest })
    } catch (error) {
      console.error('Error making seraph request', error)
    }
  }

  return {
    info,
    error: requestError || error,
    response,
    makeSeraphRequest,
    seraphChatHistory,
  }
}
