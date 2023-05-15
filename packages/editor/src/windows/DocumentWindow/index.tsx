// DOCUMENTED
/**
 * DocumentWindow is a React component that displays documents in a database table.
 * It relies on the useConfig hook to retrieve the database configuration from a context.
 * It uses the DatabaseTable component to display documents in the table.
 * @returns a React component
 */

import { useEffect, useState } from 'react'
import DatabaseTable from './DocumentTable'
import { LoadingScreen, useConfig } from '@magickml/client-core'
import { useSelector } from 'react-redux'
import { API_ROOT_URL, PRODUCTION, DEFAULT_USER_TOKEN } from '@magickml/core'

const DocumentWindow = () => {
  const config = useConfig()
  const globalConfig = useSelector((state: any) => state.globalConfig)
  const token = globalConfig?.token

  // Initialize the documents state to null using the useState hook
  const [documents, setDocuments] = useState(null)
  const [loading, setLoading] = useState(null)

  /**
   * Fetches Documents from the server and updates the state.
   * @returns void
   */
  const fetchDocuments = async () => {
    setLoading(true)
    const response = await fetch(
      `${API_ROOT_URL}/documents?hidden=false&projectId=${config.projectId}`,
      {
        headers: PRODUCTION
          ? { Authorization: `Bearer ${token}` }
          : { Authorization: `Bearer ${DEFAULT_USER_TOKEN}` },
      }
    )
    const data = await response.json()
    setLoading(false)
    setDocuments(data.data)
  }

  /**
   * Resets the document state by fetching all documents from the server.
   * @returns void
   */
  const resetDocuments = async () => {
    await fetchDocuments()
  }

  // Call fetchDocuments when the component mounts
  useEffect(() => {
    fetchDocuments()
  }, [])

  return (
    // Use div container to display the DatabaseTable
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

      {/* Only render the DatabaseTable component if documents is not null */}
      {documents && (
        <DatabaseTable documents={documents} updateCallback={resetDocuments} />
      )}
    </div>
  )
}

export default DocumentWindow
