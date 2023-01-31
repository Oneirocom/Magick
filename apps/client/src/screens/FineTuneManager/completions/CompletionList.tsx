import FileListTable from '../files/FileListTable'
import UploadFileButton from '../files/UploadFileButton'
import FineTuneList from '../fine-tunes/FineTuneList'
import UsageInstructions from '../instructions/UsageInstructions'
import React from 'react'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'

export default function ClassificationList() {
  const navigate = useNavigate()
  return (
    <main className="mx-auto space-y-12 max-w-4xl">
      <section className="space-y-4">
        <div className="flex flex-nowrap justify-between items-center">
          <h1 className="text-3xl">Completions</h1>
          <Button
            size="small"
            onClick={() => navigate('/fineTuneManager/fine-tunes/new')}
          >
            New Model
          </Button>
        </div>
        <FineTuneList />
      </section>
      <section className="space-y-4">
        <div className="flex flex-nowrap justify-between items-center">
          <h2 className="text-3xl">Training Files</h2>
          <UploadFileButton
            purpose="fine-tune"
            enforce={{
              required: ['prompt', 'completion'],
              count: ['prompt', 'completion'],
              maxTokens: 2048,
            }}
          />
        </div>
        <FileListTable purpose="fine-tune" />
      </section>
      <UsageInstructions>
        To classify with more than 200 examples, upload a file containing
        classification examples and labels. The file can be CSV, Excel, or
        JSONL. It must contain the fields "text" and "label", and may also
        include the column "metadata". For Excel, the first column is "text" and
        the second column is "label". [More
        details](https://beta.openai.com/docs/guides/classifications). - All
        labels need to be capitalized. If not, input labels will be formatted at
        the backend. - Each label needs to be prepended with a white space when
        encoded by the tokenizer. - We highly recommend that each label is a
        single token word. - If every label is a single token, the calculated
        probabilities would be precise. Otherwise the probabilities are
        approximations. For example:
      </UsageInstructions>
    </main>
  )
}
