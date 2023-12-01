import { Modal } from 'client/core'
import {
  Backdrop,
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import TextField from '@mui/material/TextField'
import { useEffect, useState } from 'react'
import { useSnackbar } from 'notistack'

const IntentModal = ({
  createMode,
  setCreateMode,
  handleSave,
  setNewIntent,
  providerList,
  chatProviderList,
}) => {
  const [loading, setLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const [newIntent, setIntent] = useState({
    type: '',
    content: '',
    intent: '',
    variations: 0,
  })

  useEffect(() => {
    setNewIntent(newIntent)
  }, [newIntent])

  const [selectedModel, setSelectedModel] = useState<{ model: string, object: any } | null>(null)

  const handleModelChange = event => {
    const selectedModelValue = event.target.value
    const selectedObject = providerList.find(provider =>
      provider.models.includes(selectedModelValue)
    )
    setSelectedModel({ model: selectedModelValue, object: selectedObject })
  }

  const handleSaveIntent = () => {
    setLoading(true)
    if (newIntent.type) {
      handleSave(selectedModel)
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
      handleAction={handleSaveIntent}
    >
      {loading && (
        <Backdrop
          open={loading}
          sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
        >
          <CircularProgress color="secondary" />
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
              Add intents
            </Typography>
          </Grid>
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
              Select Embedding Model
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
              onChange={e => setIntent({ ...newIntent, type: e.target.value })}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <Typography
              style={{ width: '100%', margin: '.5em' }}
              variant={'h6'}
              fontWeight={'bold'}
            >
              Intent
            </Typography>
            <TextField
              name="intent"
              style={{ width: '100%', margin: '.5em' }}
              onChange={e =>
                setIntent({ ...newIntent, intent: e.target.value })
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
            value={newIntent.content}
            onChange={e => setIntent({ ...newIntent, content: e.target.value })}
            required
            multiline
            rows={5}
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
            Variations
          </Typography>
          <TextField
            name="intent"
            style={{ width: '100%', margin: '.5em' }}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            onChange={e =>
              setIntent({ ...newIntent, variations: parseInt(e.target.value) })
            }
            required
          />
        </Grid>
      </Grid>
    </Modal>
  )
}

export default IntentModal
