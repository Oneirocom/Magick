import DetailsPage from '../components/DetailsPage'
import React from 'react'
import useSWRImmutable from 'swr/immutable'
import type { OpenAI } from '../../../../../../@types/openai'
import FineTuneMetadata from '../fine-tunes/FineTuneMetadata'
import FineTuneResultsCard from '../fine-tunes/FineTuneResultsCard'
import CompletionForm from './CompletionForm'
import { useParams } from 'react-router'
import LoginRequired from '../account/LoginRequired'

export default function CompletionDetails() {
  const { fineTuneId } = useParams()
  console.log({ fineTuneId })
  if (!fineTuneId) return <></>
  const { data: fineTune, error } = useSWRImmutable<OpenAI.FineTune>(
    `fine-tunes/${fineTuneId}`
  )

  return (
    <LoginRequired>
      <DetailsPage name="Fine Tune" id={fineTuneId} error={error}>
        {fineTune ? (
          <>
            <CompletionForm fineTune={fineTune} />
            <FineTuneMetadata fineTune={fineTune} />
            <FineTuneResultsCard fineTune={fineTune} />
          </>
        ) : (
          <></>
        )}
      </DetailsPage>
    </LoginRequired>
  )
}
