// DOCUMENTED
import { API_ROOT_URL } from 'shared/config'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { LoadingScreen, useConfig } from '@magickml/client-core'
import DocumentTable from './DocumentTable'

/**
 * DocumentWindow component displays the documents of a project.
 * @returns JSX Element
 */
const DocumentWindow = (): JSX.Element => {
  const globalConfig = useSelector((state: any) => state.globalConfig)
  const token = globalConfig?.token
  const config = useConfig()
  const [documents, setDocuments] = useState<Document[] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)
    fetchDocuments()
  }, [])

  /**
   * Resets the events and fetches the updated events.
   */
  const resetDocuments = async (): Promise<void> => {
    await fetchDocuments()
  }

  /**
   * Fetches the events of the current project.
   */
  const fetchDocuments = async (): Promise<void> => {
    try {
      const response = await fetch(
        `${API_ROOT_URL}/documents?projectId=${config.projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()
      setLoading(false)
      setDocuments(data.data)
    } catch (error) {
      console.error('ERROR', error)
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
      {documents && (
        <DocumentTable documents={documents} updateCallback={resetDocuments} />
      )}
    </div>
  )
}

export default DocumentWindow
