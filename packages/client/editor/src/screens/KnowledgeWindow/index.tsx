// DOCUMENTED
import { LoadingScreen } from 'client/core'
import KnowledgeTable from './KnowledgeTable'
import { useGetKnowledgeQuery } from 'client/state'

/**
 * KnowledgeWindow component displays the documents of a project.
 * @returns JSX Element
 */
const KnowledgeWindow = (): React.JSX.Element => {
  const { data: knowledge, isLoading } = useGetKnowledgeQuery({})

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
      {knowledge && (
        <KnowledgeTable knowledgeData={knowledge.data} />
      )}
    </div>
  )
}

export default KnowledgeWindow
