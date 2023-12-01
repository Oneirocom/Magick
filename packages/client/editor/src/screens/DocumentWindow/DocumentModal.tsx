import { Modal } from 'client/core'
import {
  Backdrop,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'
import styles from './index.module.scss'
import { useSnackbar } from 'notistack'

const DocumentModal = ({
  createMode,
  setCreateMode,
  handleSave,
  setNewDocument,
  providerList,
}) => {
  const [loading, setLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const [newDocument, setDocument] = useState({
    type: '',
    content: '',
    files: [],
  })

  useEffect(() => {
    setNewDocument(newDocument)
  }, [newDocument])

  function handleFileUpload() {
    const inputElement = document.createElement('input')
    inputElement.type = 'file'
    inputElement.accept =
      '.eml,.html,.json,.md,.msg,.rst,.rtf,.txt,.xml,.jpeg,.jpg,.png,.csv,.doc,.docx,.epub,.odt,.pdf,.ppt,.pptx,.tsv,.xlsx' // Specify the file formats to accept, if needed
    inputElement.click()
    inputElement.addEventListener('change', async (event: Event) => {
      const files = (event.target as HTMLInputElement).files

      console.log('files', files)

      if (files && files.length > 0) {
        setLoading(true)
        const newfiles = []
        for (const file of files) {
          newfiles.push(file)
        }
        setDocument({ ...newDocument, files: newfiles })
        setLoading(false)
      }
    })
  }

  const [selectedModel, setSelectedModel] = useState(null)

  const handleModelChange = event => {
    const selectedModelValue = event.target.value
    const selectedObject = providerList.find(provider =>
      provider.models.includes(selectedModelValue)
    )
    setSelectedModel({ model: selectedModelValue, object: selectedObject })
  }

  const handleSaveDocument = async () => {
    setLoading(true)
    if (newDocument.type) {
      await handleSave(selectedModel)
      console.log("handleSaveDocument!!!!!!!!!!!!")
      setLoading(false)
    } else {
      setLoading(false)
      enqueueSnackbar('Please fill in all required fields.', {
        variant: 'error',
      })
    }
  }

  return (
    <Modal
      open={createMode}
      onClose={() => {
        setCreateMode(!createMode)
      }}
      submitText="Generate Embeddings and Save"
      handleAction={handleSaveDocument}
    >
      {loading && (
        <Backdrop
          open={loading}
          sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
        >
          <CircularProgress className={styles.loader} />
        </Backdrop>
      )}
      <Grid container>
        <Grid container direction="row" justifyContent="space-between">
          <Grid item>
            <Typography
              variant={'h5'}
              fontWeight={'bold'}
              style={{ margin: '0.5rem' }}
            >
              Add Document
            </Typography>
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
          style={{ display: 'flex', gap: '5rem', alignItems: 'center' }}
        >
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
            <Typography
              style={{ width: '100%', margin: '.5em' }}
              variant={'h6'}
              fontWeight={'bold'}
            >
              Select Model
            </Typography>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedModel?.model || ''}
              label="Model"
              onChange={handleModelChange}
              fullWidth
            >
              {providerList.map((provider, index) =>
                provider.models.map(model => (
                  <MenuItem key={`${provider.subtype}-${index}`} value={model}>
                    {model}
                  </MenuItem>
                ))
              )}
            </Select>
          </Grid>
          <Grid item xs={6}>
            <Typography
              style={{ width: '100%', margin: '.5em' }}
              variant={'h6'}
              fontWeight={'bold'}
            >
              Type
            </Typography>
            <TextField
              name="type"
              style={{ width: '100%', margin: '.5em' }}
              onChange={e =>
                setDocument({ ...newDocument, type: e.target.value })
              }
              required
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography
            style={{ width: '100%', margin: '.5em' }}
            variant={'h6'}
            fontWeight={'bold'}
          >
            Content
          </Typography>
          <TextField
            name="Content"
            style={{ width: '100%', margin: '.5em' }}
            value={newDocument.content}
            onChange={e =>
              setDocument({ ...newDocument, content: e.target.value })
            }
            required
            multiline
            rows={5}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography style={{ width: '100%', margin: '.5em' }} variant={'h6'}>
            Add &lt;&lt;BREAK&gt;&gt; anywhere in your content to force a chunk
            break at this point
          </Typography>
        </Grid>
      </Grid>
    </Modal>
  )
}

export default DocumentModal
