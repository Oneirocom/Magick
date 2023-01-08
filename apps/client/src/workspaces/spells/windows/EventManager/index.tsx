import { useEffect, useState } from 'react'
import axios from 'axios'
import EventTable from './EventTable'
import { usePubSub } from '../../../../contexts/PubSubProvider'

const EventManagerWindow = ({ tab }) => {
  const [events, setEvents] = useState(null)
  const { events: eventMap, subscribe } = usePubSub()

  useEffect(() => {
    fetchEvents()

    return subscribe(
      eventMap.$REFRESH_EVENT_TABLE(tab.id),
      fetchEvents
    ) as () => void
  }, [])

  const resetEvents = async () => {
    await fetchEvents()
  }

  const fetchEvents = async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_APP_API_URL}/events`
    )
    setEvents(data)
  }

  return (
    <div className="agent-container">
      {events && <EventTable events={events} updateCallback={resetEvents} />}
    </div>
  )
}

export default EventManagerWindow
