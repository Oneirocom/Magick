// DOCUMENTED
import { API_ROOT_URL } from 'shared/config'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { LoadingScreen } from 'client/core'
import { useConfig } from '@magickml/providers'
import IntentTable from './IntentTable'

/**
 * IntentWindow component displays the intents of a project.
 * @returns JSX Element
 */
const IntentWindow = (): JSX.Element => {
  const globalConfig = useSelector((state: any) => state.globalConfig)
  const token = globalConfig?.token
  const config = useConfig()
  const [intents, setIntents] = useState<Document[] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)
    fetchIntents()
  }, [])

  /**
   * Resets the events and fetches the updated events.
   */
  const resetIntents = async (): Promise<void> => {
    await fetchIntents()
  }

  /**
   * Fetches the events of the current project.
   */
  const fetchIntents = async (): Promise<void> => {
    try {
      const response = await fetch(
        `${API_ROOT_URL}/documents?projectId=${config.projectId
        }&metadata=${encodeURI('{"intent": { "type": "story" }}')}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      data.data = data.data.map(intent => {
        return { ...intent, intent: intent.metadata.intent.name }
      })

      setLoading(false)
      setIntents(data.data)
    } catch (error) {
      console.error('ERROR', error)
    }
  }

  return (
    <div
      className="event-container"
      style={{
        paddingBottom: '1em',
        width: '100%',
        height: '100vh',
        overflow: 'scroll',
      }}
    >
      {loading && <LoadingScreen />}
      {intents && (
        <IntentTable intents={intents} updateCallback={resetIntents} />
      )}
    </div>
  )
}

export default IntentWindow
