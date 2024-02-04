// DOCUMENTED
import { LoadingScreen } from 'client/core'
import FileTable from './KnowledgeTable'
import { RootState, useGetDocumentsQuery, useGetFilesQuery } from 'client/state'
import { useSelector } from 'react-redux'
import { useConfig } from '@magickml/providers'

/**
 * DocumentWindow component displays the documents of a project.
 * @returns JSX Element
 */
const DocumentWindow = (): React.JSX.Element => {
  const config = useConfig()
  const { data: files, isLoading } = useGetFilesQuery({})

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
      {files && (
        <FileTable files={files.data} />
      )}
    </div>
  )
}

export default DocumentWindow
