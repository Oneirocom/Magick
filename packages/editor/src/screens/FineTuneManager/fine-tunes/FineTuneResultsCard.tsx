import useAuthentication from '../account/useAuthentication'
import ErrorMessage from '../components/ErrorMessage'
import InfoCard from '../components/InfoCard'
import React from 'react'
import { toast } from 'react-toastify'
import { OpenAI } from '../../../../../../@types/openai'
import useFineTuneResults from './useFineTuneResults'
import Button from '@mui/material/Button'
import Loading from '../components/Loading'
import { Box } from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import { OPENAI_ENDPOINT } from '@magickml/engine'

export type ResultFileRecord = {
  elapsed_examples: number
  elapsed_tokens: number
  step: string
  training_loss: number
  training_sequence_accuracy: number
  training_token_accuracy: number
}

export default function FineTuneResultsCard({
  fineTune,
}: {
  fineTune: OpenAI.FineTune
}) {
  const resultFile = fineTune.result_files[0]
  const { headers } = useAuthentication()
  const { results, error } = useFineTuneResults(resultFile?.id)

  async function download(file: OpenAI.File) {
    const response = await fetch(
      `${OPENAI_ENDPOINT}files/${file.id}/content`,
      { headers }
    )
    if (!response.ok) {
      toast.error(`Failed to download ${file.filename}`)
      return
    }

    const blob = await response.blob()
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.type = 'text/csv'
    link.download = file.filename
    link.click()
  }

  return (
    <InfoCard>
      <Box
        component={'span'}
        sx={{
          flexDirection: 'row',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h4>Results File</h4> {results && <>{results?.length} records</>}
        {error && <ErrorMessage error={error} />}
        {results && resultFile ? (
          <Button
            size="small"
            onClick={event => {
              event.preventDefault()
              download(resultFile)
            }}
            variant="contained"
            startIcon={<DownloadIcon />}
          >
            Download (CSV)
          </Button>
        ) : (
          <Loading />
        )}
      </Box>
    </InfoCard>
  )
}
