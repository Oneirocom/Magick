// DOCUMENTED 
import DownloadIcon from '@mui/icons-material/Download'
import { Box } from '@mui/material'
import Button from '@mui/material/Button'
import { toast } from 'react-toastify'
import useAuthentication from '../account/useAuthentication'
import ErrorMessage from '../components/ErrorMessage'
import InfoCard from '../components/InfoCard'
import Loading from '../components/Loading'
import { OpenAI } from '../types/openai'
import useFineTuneResults from './useFineTuneResults'

import { OPENAI_ENDPOINT } from '../constants'

// Interface for ResultFileRecord
export interface ResultFileRecord {
  elapsed_examples: number
  elapsed_tokens: number
  step: string
  training_loss: number
  training_sequence_accuracy: number
  training_token_accuracy: number
}

/**
 * FineTuneResultsCard component to display fine-tuning results.
 *
 * @param {OpenAI.FineTune} fineTune - FineTuning data
 * @returns {JSX.Element} FineTuneResultsCard component
 */
export default function FineTuneResultsCard({
  fineTune,
}: {
  fineTune: OpenAI.FineTune
}): JSX.Element {
  const resultFile = fineTune.result_files[0]
  const { headers } = useAuthentication()
  const { results, error } = useFineTuneResults(resultFile?.id)

  /**
   * Download the fine-tuning results file.
   *
   * @param {OpenAI.File} file - File to download
   */
  async function download(file: OpenAI.File): Promise<void> {
    const response = await fetch(
      `${OPENAI_ENDPOINT}/files/${file.id}/content`,
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
            onClick={(event) => {
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