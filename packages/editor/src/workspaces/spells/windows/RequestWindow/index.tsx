import { useEffect, useState } from 'react'
import axios from 'axios'
import RequestTable from './RequestTable'
import { useConfig } from '../../../../contexts/ConfigProvider'

const RequestWindow = () => {
  const config = useConfig()
  const [requests, setRequests] = useState(null)

  useEffect(() => {
    fetchRequests()
    console.log('fetching events')
  }, [])

  const resetEvents = async () => {
    await fetchRequests()
  }

  const fetchRequests = async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_APP_API_URL}/request?hidden=false&projectId=${config.projectId}`
    )
    console.log('fetching events', data)
    setRequests(data.data)
  }

  return (
    <div className="event-container" style={{paddingBottom: "1em", width: "100%", height: "100vh", "overflow": "scroll"}}>
      {requests && <RequestTable requests={requests} updateCallback={resetEvents} />}
    </div>
  )
}

export default RequestWindow
