import FileListTable from '../files/FileListTable'
import UploadFileButton from '../files/UploadFileButton'
import FineTuneList from '../fine-tunes/FineTuneList'
import ExpansionDetails from '../components/ExpansionDetails'
import React from 'react'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'
// TODO @thomageanderson: resolve the type warning on this markdown import
import { html as CompletionInstructions } from './instructions.md'
import { Box, Typography } from '@mui/material'

export default function ClassificationList() {
  const navigate = useNavigate()
  return (
    <main className="mx-auto space-y-12 max-w-4xl">
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
            onClick={() => navigate('/fineTuneManager/fine-tunes/new')}
          >
            New Model
          </Button>
        </Box>
      </Box>
      <FineTuneList />

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
      <ExpansionDetails title={'Usage Instructions'}>
        <div dangerouslySetInnerHTML={{ __html: CompletionInstructions }} />
      </ExpansionDetails>
    </main>
  )
}
