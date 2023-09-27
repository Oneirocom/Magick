// DOCUMENTED
/**
 * This module exports a `RequestWindow` functional component
 * @module RequestWindow
 */

import { useEffect, useState } from 'react'

import RequestTable from './RequestTable'

import { API_ROOT_URL } from 'shared/config'
import { LoadingScreen, useConfig } from 'client/core'
import { useSelector } from 'react-redux'

/**
 * The RequestWindow functional component fetches and renders a table containing
 * a list of all the requests belonging to the provided projectId.
 * @returns {JSX.Element} A React component that renders a request table.
 */
const RequestWindow = () => {
  const config = useConfig()
  const globalConfig = useSelector((state: any) => state.globalConfig)
  const [requests, setRequests] = useState(null)
  const [loading, setLoading] = useState<boolean>(false)

  /**
   * A React side-effect hook that fetches requests.
   */
  useEffect(() => {
    setLoading(true)
    fetchRequests()
  }, [])

  /**
   * A function that resets the events.
   * @async
   */
  const resetEvents = async () => {
    await fetchRequests()
  }

  const token = globalConfig?.token

  /**
   * A function that fetches requests from the API.
   * @async
   */
  const fetchRequests = async () => {
    try {
      const response = await fetch(
        `${API_ROOT_URL}/request?hidden=false&projectId=${config.projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      const data = await response.json()
      setLoading(false)
      setRequests(data.data)
    } catch (error) {
      console.error('Error fetching requests:', error)
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
      {requests && (
        <RequestTable requests={requests} updateCallback={resetEvents} />
      )}
    </div>
  )
}

export default RequestWindow
