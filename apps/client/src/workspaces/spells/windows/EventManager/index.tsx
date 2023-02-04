import { useEffect, useState } from 'react'
import axios from 'axios'
import EventTable from './EventTable'
import { usePubSub } from '../../../../contexts/PubSubProvider'

const EventManagerWindow = () => {
  const [events, setEvents] = useState(null)

  useEffect(() => {
    fetchEvents()
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
