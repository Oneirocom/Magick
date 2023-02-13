import { useEffect, useState } from 'react'
import axios from 'axios'
import EventTable from './EventTable'

const EventManagerWindow = () => {
  const [events, setEvents] = useState(null)

  useEffect(() => {
    fetchEvents()
    console.log('fetching events')
  }, [])

  const resetEvents = async () => {
    await fetchEvents()
  }

  const fetchEvents = async () => {
    // const { data } = await axios.get(
    //   `${import.meta.env.VITE_APP_API_URL}/events`
    // )
    // console.log('fetching events', data)
    // setEvents(data)
    setEvents([]) // TODO: Fix this
  }

  return (
    <div className="agent-container">
      {events && <EventTable events={events} updateCallback={resetEvents} />}
    </div>
  )
}

export default EventManagerWindow
