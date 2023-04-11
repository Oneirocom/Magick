// DOCUMENTED
import { API_ROOT_URL, IGNORE_AUTH } from '@magickml/core'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useConfig } from '../../contexts/ConfigProvider'
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

  useEffect(() => {
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
      const headers = IGNORE_AUTH ? {} : { Authorization: `Bearer ${token}` }

      const response = await fetch(
        `${API_ROOT_URL}/events?projectId=${config.projectId}`,
        {
          headers,
        }
      )

      const data = await response.json()
      setEvents(data.events)
    } catch (error) {
      console.log(error)
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
      {events && <EventTable events={events} updateCallback={resetEvents} />}
    </div>
  )
}

export default EventWindow
