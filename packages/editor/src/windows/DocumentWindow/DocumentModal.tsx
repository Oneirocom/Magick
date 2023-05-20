import { Modal } from '@magickml/client-core';
import { Backdrop, Button, CircularProgress, Grid, MenuItem, Select, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { convertFileToText } from './documentconvert';
import styles from './index.module.scss'

const DocumentModal = ({ createMode, setCreateMode, handleSave, setNewDocument, providerList }) => {
  const [loading, setLoading] = useState(false);
  const [newDocument, setDocument] = useState({
    type: '',
    content: ''
  });

  useEffect(() => {
    setNewDocument(newDocument);
  }, [newDocument]);

  function handleFileUpload() {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = '.pdf,.doc,.docx,.doc,.xlsx,.xls,.ppt,.pptx'; // Specify the file formats to accept, if needed
    inputElement.click();
    inputElement.addEventListener('change', async (event: Event) => {
      const files = (event.target as HTMLInputElement).files;

      if (files && files.length > 0) {
        const uploadedFile = files[0];
        setLoading(true);
        const text = await convertFileToText(uploadedFile)
        setLoading(false)
        console.log(text)
        setDocument({ ...newDocument, content: Array.isArray(text) ? text.join() : text })
      }
    });
  }

  const [selectedModel, setSelectedModel] = useState(null);

  const handleModelChange = (event) => {
    const selectedModelValue = event.target.value;
    const selectedObject = providerList.find(
      (provider) => provider.models.includes(selectedModelValue)
    );
    setSelectedModel({ model: selectedModelValue, object: selectedObject });
  };

  const handleSaveDocument = () => {
    if (newDocument.type) {
      handleSave(selectedModel);
      setCreateMode(!createMode)
    } else {
      alert('Please fill in all required fields.');
    }
  };
  return (
    <Modal
      open={createMode}
      onClose={() => { setCreateMode(!createMode) }}
      submitText="Generate Embeddings and Save"
      handleAction={handleSaveDocument}
    >
      {loading && <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}><CircularProgress color="secondary" /></Backdrop>}
      <Grid container>

        <Grid container direction="row" justifyContent="space-between">
          <Grid item>
            <Typography variant={'h5'} fontWeight={"bold"} style={{ margin: '0.5rem' }}>Add documents</Typography>
          </Grid>
          <Button
            className={styles.btn}
            variant="outlined"
            style={{ marginLeft: '1rem' }}
            onClick={handleFileUpload}
          >
            Upload
          </Button>
        </Grid>
        <Grid
          item
          xs={12}
          style={{ display: "flex", gap: "5rem", alignItems: "center" }}>
          {/* <Grid item xs={8}>
            <Typography style={{ width: '100%', margin: '.5em' }} variant={'h6'} fontWeight={"bold"}>Name</Typography>
            <TextField
              label="Name"
              name="name"
              style={{ width: '100%', margin: '.5em' }}
              onChange={(e) => setDocument({ ...newDocument, name: e.target.value })}
              required
            />
          </Grid> */}
          <Grid item xs={6}>
            <Typography style={{ width: '100%', margin: '.5em' }} variant={'h6'} fontWeight={"bold"} >Select Model</Typography>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedModel?.model || ''}
              label="Model"
              onChange={handleModelChange}
              fullWidth
            >
              {providerList.map((provider, index) =>
                provider.models.map((model) => (
                  <MenuItem key={`${provider.subtype}-${index}`} value={model}>
                    {model}
                  </MenuItem>
                ))
              )}
            </Select>
          </Grid>
          <Grid item xs={6}>
            <Typography style={{ width: '100%', margin: '.5em' }} variant={'h6'} fontWeight={"bold"} >Type</Typography>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={newDocument.type}
              label="Document"
              onChange={(e) => setDocument({ ...newDocument, type: e.target.value })}
              fullWidth
            >
              <MenuItem value={"Document"}>Document</MenuItem>
              <MenuItem value={"Skill"}>Skill</MenuItem>
              <MenuItem value={"Intent"}>Intent</MenuItem>
            </Select>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography style={{ width: '100%', margin: '.5em' }} variant={'h6'} fontWeight={"bold"}>Content</Typography>
          <TextField
            name="Content"
            style={{ width: '100%', margin: '.5em' }}
            value={newDocument.content}
            onChange={(e) => setDocument({ ...newDocument, content: e.target.value })}
            required
            multiline
            rows={5}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography style={{ width: '100%', margin: '.5em' }} variant={'h6'}>
            Add &lt;&lt;BREAK&gt;&gt; anywhere in your content to force a chunk break at this point
          </Typography>
        </Grid>
      </Grid>
    </Modal>
  );
};

export default DocumentModal;