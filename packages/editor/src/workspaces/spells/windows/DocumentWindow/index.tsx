import { useEffect, useState } from 'react'
import DatabaseTable from './DocumentTable'
import { useConfig } from '../../../../contexts/ConfigProvider'
import { API_ROOT_URL } from '@magickml/engine'

const DatabaseWindow = () => {
  const config = useConfig()
  const [documents, setDatabases] = useState(null)

  useEffect(() => {
    fetchDatabases()
  }, [])

  const resetDocuments = async () => {
    await fetchDatabases()
  }

  const fetchDatabases = async () => {
    const response = await fetch(`${API_ROOT_URL}/documents?hidden=false&projectId=${config.projectId}`)
    const data = await response.json()
    setDatabases(data.data)
  }

  return (
    <div className="event-container" style={{paddingBottom: "1em", width: "100%", height: "100vh", "overflow": "scroll"}}>
      {documents && <DatabaseTable documents={documents} updateCallback={resetDocuments} />}
    </div>
  )
}

export default DatabaseWindow
