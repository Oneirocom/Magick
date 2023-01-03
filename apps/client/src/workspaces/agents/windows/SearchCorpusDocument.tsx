//@ts-nocheck
import { useEffect, useState } from 'react'
import { useModal } from '@/contexts/ModalProvider';
import { VscWand, VscTrash, VscSave } from 'react-icons/vsc'
import axios from 'axios'
import { useSnackbar } from 'notistack';

const SearchCorpusDocument = ({ document, getDoc }) => {
  const [isInclude, setIsInclude] = useState(document.isIncluded)
  const [contentObjects, setContentObjects] = useState(null)
  const { openModal } = useModal()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    (async () => await getContentObjects())()
  }, [])

  const getContentObjects = async () => {
    console.log('get documents store');
    const res = await axios.get(
      `${process.env.REACT_APP_SEARCH_SERVER_URL}/content-object`,
      {
        params: {
          documentId: document.id
        }
      }
    )
    console.log('objects ::: ', res.data);
    setContentObjects(res.data)
  }

  const openAddModal = () => {
    openModal({
      modal: 'documentAddModal',
      isContentObject: true,
      documentId: document.id,
      getDocuments: getDoc,
      getContentObjects
    })
  }

  const openEditModal = (field: string) => {
    openModal({
      modal: 'documentEditModal',
      field,
      document,
      getDocuments: getDoc
    })
  }
  
  const openDeleteModal = () => {
    openModal({
      modal: 'documentDeleteModal',
      documentId: document.id,
      isContentObj: false,
      getDocuments: getDoc
    })
  }

  const openContentEditModal = () => {
    openModal({
      modal: 'contentObjEditModal',
      contents: contentObjects,
      getContentObjects
    })
  }

  const saveDocument = async () => {
    const { id, ..._document } = document
    const body = {
      ..._document,
      documentId: id,
      isIncluded: isInclude
    }
    console.log('body ::: ', body);
    await axios.post(
      `${process.env.REACT_APP_SEARCH_SERVER_URL}/update_document`,
      body
    )
    enqueueSnackbar('Document updated', { variant: 'success' })
    await getDoc()
  }

  return (
    <div className="search-corpus-document">
      <div className="d-flex align-items-center justify-content-between">
        <div className="form-item">
          <input 
            type="checkbox" 
            name="include" 
            className="custom-checkbox" 
            checked={isInclude} 
            onChange={() => setIsInclude(!isInclude)} 
          />
          <span className="form-item-label" style={{ marginBottom: 'unset' }}>Include</span>
        </div>
        <div className="form-item">
          <VscSave size={20} color='#A0A0A0' onClick={saveDocument} style={{ margin: '0 0.5rem'}}/>
          <VscTrash size={20} color='#A0A0A0' onClick={openDeleteModal}/>
        </div>
      </div>
      <div className="form-item">
        <span className="form-item-label">Title</span>
        <div className="d-flex justify-content-between align-items-center">
          <input
            type="text"
            className="form-text-area"
            style={{ width: '96%' }}
            value={document.title}
            readOnly
          ></input>
          <VscWand size={20} color='#A0A0A0' onClick={() => openEditModal('title')}/>  
        </div>
      </div>
      <div className="form-item">
        <span className="form-item-label">Description</span>
        <div className="d-flex justify-content-between align-items-center">
          <input
            type="text"
            className="form-text-area"
            style={{ width: '96%' }}
            value={document.description}
            readOnly
          ></input>
          <VscWand size={20} color='#A0A0A0' onClick={() => openEditModal('description')}/>  
        </div>
      </div>
      <div className="form-item search-corpus">
        <span className="form-item-label">Type</span>
        <select
          name="documents"
          id="documents"
        >
          <option value="document">Document</option>
        </select>
      </div>

      <div className="form-item">
        <span className="form-item-label">Content</span>
        <div className="d-flex ">
          <button
            className="button search-corpus-btn"
            type="button"
            onClick={async e => {
              e.preventDefault()
              openContentEditModal()
            }}
          >
            Click to edit
          </button>
          <button
            className="button search-corpus-btn"
            type="button"
            onClick={async e => {
              e.preventDefault()
              openAddModal()
            }}
          >
            Click to add
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchCorpusDocument;