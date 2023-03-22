import { useEffect, useState } from 'react'
import axios from 'axios'
import RequestTable from './RequestTable'
import { useConfig } from '../../contexts/ConfigProvider'
import { API_ROOT_URL } from '@magickml/engine'

const RequestWindow = () => {
  const config = useConfig()
  const [requests, setRequests] = useState(null)

  useEffect(() => {
    fetchRequests()
  }, [])

  const resetEvents = async () => {
    await fetchRequests()
  }

  const fetchRequests = async () => {
    const { data } = await axios.get(
      `${API_ROOT_URL}/requests?hidden=false&projectId=${config.projectId}`
    )
    setRequests(data.data)
  }

  return (
    <div className="event-container" style={{paddingBottom: "1em", width: "100%", height: "100vh", "overflow": "scroll"}}>
      {requests && <RequestTable requests={requests} updateCallback={resetEvents} />}
    </div>
  )
}

export default RequestWindow
