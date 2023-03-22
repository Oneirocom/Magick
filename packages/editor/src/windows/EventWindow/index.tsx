import { useEffect, useState } from 'react'
import axios from 'axios'
import EventTable from './EventTable'
import { useConfig } from '../../contexts/ConfigProvider'
import { API_ROOT_URL } from '@magickml/engine'

const EventWindow = () => {
  const config = useConfig()
  const [events, setEvents] = useState(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const resetEvents = async () => {
    await fetchEvents()
  }

  const fetchEvents = async () => {
    const { data } = await axios.get(
      `${API_ROOT_URL}/events?projectId=${config.projectId}`
    )
    setEvents(data.events)
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
