// DOCUMENTED
import { API_ROOT_URL, DEFAULT_USER_TOKEN, PRODUCTION } from '@magickml/core'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { LoadingScreen, useConfig } from '@magickml/client-core'
import EventTable from './EventTable'

/**
 * Defines the properties of an event.
 */
interface Event {
  // Add properties of the event
  name: string
  location: string
}

/**
 * EventWindow component displays the events of a project.
 * @returns JSX Element
 */
const EventWindow = (): JSX.Element => {
  const globalConfig = useSelector((state: any) => state.globalConfig)
  const token = globalConfig?.token
  const config = useConfig()
  const [events, setEvents] = useState<Event[] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)
    fetchEvents()
  }, [])

  /**
   * Resets the events and fetches the updated events.
   */
  const resetEvents = async (): Promise<void> => {
    await fetchEvents()
  }

  /**
   * Fetches the events of the current project.
   */
  const fetchEvents = async (): Promise<void> => {
    try {
      const headers = PRODUCTION
        ? { Authorization: `Bearer ${token}` }
        : { Authorization: `Bearer ${DEFAULT_USER_TOKEN}` }

      const response = await fetch(
        `${API_ROOT_URL}/events?projectId=${config.projectId}`,
        {
          headers,
        }
      )

      const data = await response.json()
      setLoading(false)
      setEvents(data.events)
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
      {events && <EventTable events={events} updateCallback={resetEvents} />}
    </div>
  )
}

export default EventWindow
