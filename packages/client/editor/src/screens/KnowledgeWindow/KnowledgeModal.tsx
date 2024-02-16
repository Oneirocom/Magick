import { Modal } from 'client/core'
import {
  Backdrop,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'
import styles from './index.module.scss'
import { DataType } from './knowledgeTypes'
import { NewKnowledgeState } from './KnowledgeTable'

const KnowledgeModal = ({
  createMode,
  setCreateMode,
  handleSave,
  setNewKnowledge,
}) => {
  const [loading, setLoading] = useState(false)
  const [newKnowledge, setKnowledge] = useState<Partial<NewKnowledgeState>>({
    tag: '',
    name: '',
    sourceUrl: '',
    dataType: '',
    files: [],
  })

  useEffect(() => {
    setNewKnowledge(newKnowledge)
  }, [newKnowledge])

  function handleDataTypesChange(
    event: unknown & { target: { value: unknown; name: string } }
  ) {
    setKnowledge({ ...newKnowledge, dataType: event.target.value as string })
  }

  function handleFileUpload() {
    const inputElement = document.createElement('input')
    inputElement.type = 'file'
    inputElement.multiple = false
    inputElement.accept =
      '.eml,.html,.json,.md,.msg,.rst,.rtf,.txt,.xml,.jpeg,.jpg,.png,.csv,.doc,.docx,.epub,.odt,.pdf,.ppt,.pptx,.tsv,.xlsx' // Specify the file formats to accept, if needed
    inputElement.click()
    inputElement.addEventListener('change', async (event: Event) => {
      const files = (event.target as HTMLInputElement).files

      if (files?.length === 1) {
        setLoading(true)
        const file = files[0]
        setKnowledge({ ...newKnowledge, files: [file], name: file.name })
        setLoading(false)
        return
      }

      // leaving this for when we handle multiple uploads again
      if (files && files.length > 0) {
        setLoading(true)
        const newfiles = [] as File[]

        for (const file of files) {
          newfiles.push(file)
        }
        setKnowledge({ ...newKnowledge, files: newfiles })
        setLoading(false)
      }
    })
  }

  const [selectedModel] = useState(null)

  const handleSaveKnowledge = async () => {
    setLoading(true)

    await handleSave(selectedModel)

    setLoading(false)
  }

  return (
    <Modal
      open={createMode}
      onClose={() => {
        setCreateMode(!createMode)
      }}
      submitText="Upload"
      handleAction={handleSaveKnowledge}
    >
      {loading && (
        <Backdrop
          open={loading}
          sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
        >
          <CircularProgress className={styles.loader} />
        </Backdrop>
      )}
      {!loading && (
        <Grid container>
          <Grid container direction="row" justifyContent="space-between">
            <Grid item>
              <Typography
                variant={'h5'}
                fontWeight={'bold'}
                style={{ margin: '0.5rem' }}
              >
                Add Knowledge
              </Typography>
            </Grid>
            <Button
              className={styles.btn}
              variant="outlined"
              style={{ marginLeft: '1rem' }}
              onClick={handleFileUpload}
            >
              Upload files
            </Button>
          </Grid>
          <Grid
            item
            xs={12}
            style={{ display: 'flex', gap: '5rem', alignItems: 'center' }}
          >
            <Grid item xs={12}>
              <Typography
                style={{ width: '100%', margin: '.5em' }}
                variant={'h6'}
                fontWeight={'bold'}
              >
                Name
              </Typography>
              <TextField
                label="Name"
                name="name"
                value={newKnowledge.name}
                style={{ width: '100%', margin: '.5em' }}
                onChange={e =>
                  setKnowledge({ ...newKnowledge, name: e.target.value })
                }
                required
              />
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            style={{ display: 'flex', gap: '5rem', alignItems: 'center' }}
          >
            <Grid item xs={12}>
              <Typography
                style={{ width: '100%', margin: '.5em' }}
                variant={'h6'}
                fontWeight={'bold'}
              >
                Source URL
              </Typography>
              <TextField
                label="Source URL"
                name="sourcrUrl"
                disabled={!!newKnowledge?.files?.length}
                value={newKnowledge.sourceUrl}
                style={{ width: '100%', margin: '.5em' }}
                onChange={e =>
                  setKnowledge({ ...newKnowledge, sourceUrl: e.target.value })
                }
                required
              />
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            style={{ display: 'flex', gap: '5rem', alignItems: 'center' }}
          >
            <Grid item xs={6}>
              <Typography
                style={{ width: '100%', margin: '.5em' }}
                variant={'h6'}
                fontWeight={'bold'}
              >
                Tag
              </Typography>
              <TextField
                name="type"
                style={{ width: '100%', margin: '.5em' }}
                onChange={e =>
                  setKnowledge({ ...newKnowledge, tag: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <Typography
                style={{ width: '100%', margin: '.5em' }}
                variant={'h6'}
                fontWeight={'bold'}
              >
                Data Type
              </Typography>
              <FormControl fullWidth>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Data type"
                  name="dataType"
                  value={newKnowledge.dataType}
                  onChange={handleDataTypesChange}
                  required
                >
                  {Object.values(DataType).map((type, index) => (
                    <MenuItem key={index} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Modal>
  )
}

export default KnowledgeModal
