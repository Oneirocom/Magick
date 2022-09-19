process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

//@ts-nocheck
import { useState } from 'react'
import { useModal } from '@/contexts/ModalProvider'
import { VscTrash, VscSave } from 'react-icons/vsc'
import axios from 'axios'
import { useSnackbar } from 'notistack'

const ContentObject = ({ content, getContentObjects }) => {
  const { id: objId, ..._content } = content
  const [contentObj, setContentObj] = useState({
    objId,
    ..._content,
  })
  const { openModal } = useModal()
  const { enqueueSnackbar } = useSnackbar()

  const updateObj = async () => {
    const body = { ...contentObj }
    await axios.put(
      `${process.env.REACT_APP_SEARCH_SERVER_URL}/content-object`,
      body
    )
    enqueueSnackbar('Content Object updated', { variant: 'success' })
    await getContentObjects()
  }
  const deleteObj = () => {
    openModal({
      modal: 'documentDeleteModal',
      isContentObj: true,
      objId: content.id,
      getContentObjects,
    })
  }

  return (
    <div className="search-corpus-document">
      <div className="d-flex align-items-center justify-content-between">
        <div className="form-item">
          <input
            type="checkbox"
            name="include"
            className="custom-checkbox"
            checked={contentObj.isIncluded}
            onChange={() =>
              setContentObj({
                ...contentObj,
                isIncluded: !contentObj.isIncluded,
              })
            }
          />
          <span className="form-item-label" style={{ marginBottom: 'unset' }}>
            Include
          </span>
        </div>
        <div className="form-item">
          <VscSave
            size={20}
            color="#A0A0A0"
            onClick={updateObj}
            style={{ margin: '0 0.5rem' }}
          />
          <VscTrash size={20} color="#A0A0A0" onClick={deleteObj} />
        </div>
      </div>
      <div className="form-item">
        <span className="form-item-label">Title</span>
        <div className="d-flex justify-content-between align-items-center">
          <input
            type="text"
            className="form-text-area"
            value={contentObj.title}
            onChange={e => setContentObj({
              ...contentObj,
              title: e.target.value
            })}
          ></input>
        </div>
      </div>
      <div className="form-item">
        <span className="form-item-label">Description</span>
        <div className="d-flex justify-content-between align-items-center">
          <input
            type="text"
            className="form-text-area"
            value={contentObj.description}
            onChange={e =>
              setContentObj({
                ...contentObj,
                description: e.target.value,
              })
            }
          ></input>
        </div>
      </div>
      <div className="form-item search-corpus">
        <span className="form-item-label">Type</span>
        <select name="documents" id="documents">
          <option value="document">Document</option>
        </select>
      </div>
    </div>
  )
}

export default ContentObject
