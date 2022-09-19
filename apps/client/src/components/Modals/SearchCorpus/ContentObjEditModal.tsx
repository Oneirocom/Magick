import ContentObject from '@/workspaces/agents/windows/ContentObject'
import Modal from '../../Modal/Modal'

const ContentObjEditModal = ({ contents, getContentObjects }) => {
  return (
    <Modal title="Edit Content Objects" icon="add">
      <form>
        {contents.length > 0 ? (
          contents.map(content => (
            <ContentObject
              content={content}
              getContentObjects={getContentObjects}
              key={content.id}
            />
          ))
        ) : (
          <p>No content objects exists</p>
        )}
      </form>
    </Modal>
  )
}

export default ContentObjEditModal
