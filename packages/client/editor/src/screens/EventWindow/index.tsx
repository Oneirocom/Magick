// DOCUMENTED
import { LoadingScreen } from 'client/core'
import EventTable from './EventTable'
import { useGetEventsQuery } from 'client/state'

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
