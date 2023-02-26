import Button from '@mui/material/Button'
import React from 'react'

import { useNavigate } from 'react-router-dom'
import ExpansionDetails from '../components/ExpansionDetails'
import FileListTable from '../files/FileListTable'
import UploadFileButton from '../files/UploadFileButton'
import FineTuneList from '../fine-tunes/FineTuneList'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { Box, Typography } from '@mui/material'
import InfoCard from '../components/InfoCard'

// TODO @thomageanderson: resolve the type warning on this markdown import
//@ts-ignore
import { html as CompletionInstructions } from './instructions.md'

export default function ClassificationList() {
  const navigate = useNavigate()
  return (
    <main className="mx-auto space-y-12 max-w-4xl">
      <InfoCard>
        <Box component={'div'} style={{ width: '100%' }}>
          <Box
            component={'div'}
            display={'flex'}
            justifyContent={'space-between'}
            flexWrap={'nowrap'}
            flexDirection={'row'}
            padding={1}
          >
            {/* TODO @thomageanderson: remove hardcoded color when global mui themes are supported */}
            <Typography variant="h4" component="h2" color="white">
              Completions
            </Typography>
            <Button
              size="small"
              variant="contained"
              style={{backgroundColor: 'purple', color: 'white' }}
              onClick={() => navigate('/fineTuneManager/fine-tunes/new')}
              startIcon={<AddCircleOutlineIcon />}
            >
              New Model
            </Button>
          </Box>
        </Box>
        <FineTuneList />
      </InfoCard>
      <InfoCard>
        <Box component={'div'} style={{ width: '100%' }}>
          <Box
            component={'div'}
            display={'flex'}
            justifyContent={'space-between'}
            flexWrap={'nowrap'}
            flexDirection={'row'}
            padding={1}
          >
            {/* TODO @thomageanderson: remove hardcoded color when global mui themes are supported */}
            <Typography variant="h4" component="h2" color="white">
              Training Files
            </Typography>
            <UploadFileButton
              purpose="fine-tune"
              enforce={{
                required: ['prompt', 'completion'],
                count: ['prompt', 'completion'],
                maxTokens: 2048,
              }}
            />
          </Box>
        </Box>

        <FileListTable purpose="fine-tune" />
      </InfoCard>
      <InfoCard>
        <h1>Instructions</h1>
        <div dangerouslySetInnerHTML={{ __html: CompletionInstructions }} style={{minWidth: '20em', maxWidth: '80em'}}/>
      </InfoCard>
    </main>
  )
}
