import { useState } from 'react';
import { Backdrop, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { Button, Modal } from '@magickml/client-core'
import {convertFileToText, numberOfPages} from './documentconvert'
interface NewDocument {
  type: string;
  owner: string;
  content: string;
  date: string;
  embedding?: string;
}

interface Props {
  createMode: boolean;
  setCreateMode: (value: boolean) => void;
  handleSave: (newDocument: NewDocument) => void;
  setNewDocument:  React.Dispatch<React.SetStateAction<NewDocument>>;
}


function DocumentModal({ createMode, setCreateMode, handleSave, setNewDocument }: Props) {
  const [newDocument, /* setNewDocument */] = useState<any>({
    date: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(false);
  const [isMultiPage, setIsMultiPage] = useState(false);

  

  const handleDrop = async (files: File[]) => {
    const file = files[0];
    setLoading(true);
  
    /* if (await numberOfPages(file) > 1) {
      setIsMultiPage(true);
      return;
    } */
  
    const embedding = await getEmbeddingFromFile(file);
    console.log(await convertFileToText(file));
    setNewDocument(prevState => ({ ...prevState, embedding }));
    setLoading(false);
  };
  

  const getEmbeddingFromFile = async (file: File): Promise<string> => {
    // Generate a random 1536-dimensional float array
    const embedding = new Float32Array(1536);
    for (let i = 0; i < 1536; i++) {
      embedding[i] = Math.random();
    }
  
    // Return the embedding as a string
    return "[" + embedding.toString() + "]";
  };

  return (
    <Modal open={createMode} setOpen={setCreateMode} handleAction={() => handleSave(newDocument)}>
      {}
      {loading && <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}><CircularProgress color="secondary" /></Backdrop>}
      <TextField
        label="Type"
        name="type"
        style={{ width: '100%', margin: '.5em' }}
        onChange={e =>
          setNewDocument(prevState => ({ ...prevState, type: e.target.value }))
        }
      />
      <TextField
        label="Owner"
        name="owner"
        style={{ width: '100%', margin: '.5em' }}
        onChange={e =>
          setNewDocument(prevState => ({ ...prevState, owner: e.target.value }))
        }
      />
      <TextField
        label="Content"
        name="content"
        style={{ width: '100%', margin: '.5em' }}
        onChange={e =>
          setNewDocument(prevState => ({ ...prevState, content: e.target.value }))
        }
      />
      {/* <DatePicker
        label="Date"
        value={newDocument.date}
        onChange={date => setNewDocument({ ...newDocument, date: date.toISOString() })}
      /> */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <label htmlFor="embedding-upload" style={{ cursor: 'pointer' }}>
          Drop file to add embedding
        </label>
        <input
          id="embedding-upload"
          type="file"
          style={{ display: 'none' }}
          onChange={(e)=>{
            let files =[...e.target.files!]
            const file = files[0];
            numberOfPages(file).then((res)=>{
                if (res > 1) {
                    setIsMultiPage(true);
                    console.log(newDocument)
                    confirm(`'${newDocument.type}', owner '${newDocument.owner}', and date '${newDocument.date}'. `)
                    {
                        
                    }
                } else {
                    handleDrop(files)
                }

            })
          }}
        />
        {newDocument.embedding && (
          <div style={{ marginLeft: '1em' }}>
            {newDocument.embedding}
          </div>
        )}
      </div>
    </Modal>
  );
}

export default DocumentModal;
