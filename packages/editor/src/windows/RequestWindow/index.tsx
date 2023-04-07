// DOCUMENTED 
/**
 * This module exports a `RequestWindow` functional component
 * @module RequestWindow
 */

import axios from 'axios'
import { useEffect, useState } from 'react'

import RequestTable from './RequestTable'

import { API_ROOT_URL, IGNORE_AUTH } from '@magickml/core'
import { useConfig } from '../../contexts/ConfigProvider'
import globalConfig from '../../state/globalConfig'

/**
 * The RequestWindow functional component fetches and renders a table containing
 * a list of all the requests belonging to the provided projectId.
 * @returns {JSX.Element} A React component that renders a request table.
 */
const RequestWindow = () => {
  const config = useConfig()
  const [requests, setRequests] = useState(null)

  /**
   * A React side-effect hook that fetches requests.
   */
  useEffect(() => {
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
      const { data } = await axios.get(
        `${API_ROOT_URL}/request?hidden=false&projectId=${config.projectId}`,
        {
          headers: IGNORE_AUTH ? {} : { Authorization: `Bearer ${token}` },
        }
      )
      setRequests(data.data)
    } catch (error) {
      console.error('Error fetching requests:', error)
    }
  }

  return (
    <div className="event-container" style={{ paddingBottom: '1em', width: '100%', height: '100vh', overflow: 'scroll' }}>
      {requests && <RequestTable requests={requests} updateCallback={resetEvents} />}
    </div>
  )
}

export default RequestWindow