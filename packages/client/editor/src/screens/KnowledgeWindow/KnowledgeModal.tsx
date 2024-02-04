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

  const handleSaveDocument = async () => {
    setLoading(true)

    await handleSave(selectedModel)
    console.log("handleSaveDocument!!!!!!!!!!!!")
    setLoading(false)
  }

  return (
    <Modal
      open={createMode}
      onClose={() => {
        setCreateMode(!createMode)
      }}
      submitText="Upload"
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
              Type
            </Typography>
            <TextField
              name="type"
              style={{ width: '100%', margin: '.5em' }}
              onChange={e =>
                setDocument({ ...newDocument, type: e.target.value })
              }
            />
          </Grid>
        </Grid>
      </Grid>
    </Modal>
  )
}

export default DocumentModal
