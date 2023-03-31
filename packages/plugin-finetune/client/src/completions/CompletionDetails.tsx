// DOCUMENTED 
/**
 * This module exports a functional component that gets a fine tune id from the URL params and then fetches the corresponding fine tune object.
 * After fetching the fine tuneObject, it renders a details page with fine tune metadata, completion form and fine tune result card.
 * If there are any errors during the fetch, it displays an error message.
 */

import React from 'react'
import useSWRImmutable from 'swr/immutable'
import { useParams } from 'react-router-dom'
import DetailsPage from '../components/DetailsPage'
import FineTuneMetadata from '../fine-tunes/FineTuneMetadata'
import FineTuneResultsCard from '../fine-tunes/FineTuneResultsCard'
import CompletionForm from './CompletionForm'
import LoginRequired from '../account/LoginRequired'
import { OpenAI } from '../types/openai'

/**
 * Functional component that renders the details of a fine tune object.
 * @returns {JSX.Element} JSX fragment that wraps a details page displaying the fine tune metadata, fine tune result card and completion form.
 */
export default function CompletionDetails(): JSX.Element {
  const { fineTuneId } = useParams<{ fineTuneId: string }>()

  // Fetch the fine tune object based on the fineTuneId from the URL parameter
  const { data: fineTune, error } = useSWRImmutable<OpenAI.FineTune>(
    `fine-tunes/${fineTuneId}`
  )

  // If fine tune object has not been fetched yet, return an empty fragment
  if (!fineTune) {
    return <></>
  }

  // If there is any error while fetching the fine tune object, display an error message.
  if (error) {
    return <div>Something went wrong! Please try again.</div>
  }

  return (
    // Render the details page with login required component
    <LoginRequired>
      <DetailsPage name="Fine Tune" id={fineTuneId} error={error}>
        <>
          <CompletionForm fineTune={fineTune} />
          <FineTuneMetadata fineTune={fineTune} />
          <FineTuneResultsCard fineTune={fineTune} />
        </>
      </DetailsPage>
    </LoginRequired>
  )
}