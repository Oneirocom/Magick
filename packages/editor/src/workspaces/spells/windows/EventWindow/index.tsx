import { useEffect, useState } from 'react'
import axios from 'axios'
import EventTable from './EventTable'
import { useConfig } from '../../../../contexts/ConfigProvider'

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
      `${import.meta.env.VITE_APP_API_URL}/events?projectId=${config.projectId}`
    )
    setEvents(data.data)
  }

  return (
    <div className="event-container" style={{paddingBottom: "1em", width: "100%", height: "100vh", "overflow": "scroll"}}>
      {events && <EventTable events={events} updateCallback={resetEvents} />}
    </div>
  )
}

export default EventWindow
