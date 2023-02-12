import useAuthentication from '../account/useAuthentication'
import ErrorMessage from '../components/ErrorMessage'
import InfoCard from '../components/InfoCard'
import React from 'react'
import { toast } from 'react-toastify'
import { OpenAI } from '../../../../../../@types/openai'
import useFineTuneResults from './useFineTuneResults'
import Button from '@mui/material/Button'
import Loading from '../components/Loading'

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
      `https://api.openai.com/v1/files/${file.id}/content`,
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
      <h4>
        Results File
        {results && (
          <span className="ml-2 font-thin">{results.length} records</span>
        )}
      </h4>
      {error && <ErrorMessage error={error} />}
      {results && resultFile ? (
        <div className="flex gap-4 justify-between">
          <Button
            size="small"
            onClick={event => {
              event.preventDefault()
              download(resultFile)
            }}
            variant="contained"
          >
            Download (CSV)
          </Button>
        </div>
      ) : (
        <Loading />
      )}
    </InfoCard>
  )
}
