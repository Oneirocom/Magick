// DOCUMENTED
import { LoadingScreen } from 'client/core'
import EventTable from './EventTable'
import { RootState, useGetEventsQuery } from 'client/state'
import { useSelector } from 'react-redux'

/**
 * EventWindow component displays the events of a project.
 * @returns JSX Element
 */
const EventWindow = (): React.JSX.Element => {
  const globalConfig = useSelector((state: RootState) => state.globalConfig)
  const { currentAgentId } = globalConfig
  const { data, isLoading, refetch } = useGetEventsQuery(currentAgentId, {
    skip: !currentAgentId,
  })

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
      <EventTable events={data} refetchEvents={refetch} />
    </div>
  )
}

export default EventWindow
