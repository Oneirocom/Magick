// DOCUMENTED
import { API_ROOT_URL } from 'shared/config'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { LoadingScreen } from 'client/core'
import { useConfig } from '@magickml/providers'
import EventTable from './EventTable'
import { useGetEventsQuery } from 'client/state'

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
  const { data, isLoading, refetch } = useGetEventsQuery({})

  if (isLoading) return <LoadingScreen />

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

      <EventTable events={data.events} refetchEvents={refetch} />
    </div>
  )
}

export default EventWindow
