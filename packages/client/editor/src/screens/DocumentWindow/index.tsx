// DOCUMENTED
import { LoadingScreen } from 'client/core'
import DocumentTable from './DocumentTable'
import { useGetDocumentsQuery } from 'client/state'

/**
 * DocumentWindow component displays the documents of a project.
 * @returns JSX Element
 */
const DocumentWindow = (): JSX.Element => {
  const { data: documents, isLoading } = useGetDocumentsQuery({})

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
      {isLoading && <LoadingScreen />}
      {documents && (
        <DocumentTable documents={documents.data} />
      )}
    </div>
  )
}

export default DocumentWindow
