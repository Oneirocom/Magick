import { Modal } from '@magickml/client-core';
import { Backdrop, CircularProgress } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { convertFileToText } from './documentconvert';

const DocumentModal = ({ createMode, setCreateMode, handleSave, setNewDocument }) => {
  const [loading, setLoading] = useState(false);
  const [newDocument, setDocument] = useState({
    type: '',
    date: '',
    content: ''
  });

  useEffect(() => {
    setNewDocument(newDocument);
  }, [newDocument]);

  const handleFileChange = async (e) => {
   const files = [...e.target.files!][0]
    setLoading(true);
    const text = await convertFileToText(files)
    setLoading(false)
    setDocument({ ...newDocument, content: text.join('') });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    //setDocument({ ...newDocument, file: e.dataTransfer.files[0] });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSaveDocument = () => {
    if (newDocument.type) {
      handleSave(newDocument);
      setCreateMode(!createMode)
    } else {
      alert('Please fill in all required fields.');
    }
  };

  return (
    <Modal
        open={createMode}
        onClose={()=>{setCreateMode(!createMode)}}
        onSubmit={handleSaveDocument}
      >
         {loading && <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}><CircularProgress color="secondary" /></Backdrop>}
        <TextField
          label="Type"
          name="type"
          style={{ width: '100%', margin: '.5em' }}
          onChange={(e) => setDocument({ ...newDocument, type: e.target.value })}
          required
        />
        {/* <TextField
          label="Content"
          name="content"
          style={{ width: '100%', margin: '.5em' }}
          onChange={(e) => setDocument({ ...newDocument, content: e.target.value })}
        /> */}
        {/* <DatePicker
          label="Date"
          onChange={(date) => setDocument({ ...newDocument, date: date.toISOString() })}
        /> */}
        {/* <TextField
          label="Embedding"
          name="embedding"
          style={{ width: '100%', margin: '.5em' }}
          onChange={(e) => setDocument({ ...newDocument, embedding: e.target.value })}
        /> */}
        <input type="file" onChange={handleFileChange} />
        <div
          style={{ width: '100%', margin: '.5em', height: '100px' }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          Drop file here
        </div>
      </Modal>
  );
};

export default DocumentModal;