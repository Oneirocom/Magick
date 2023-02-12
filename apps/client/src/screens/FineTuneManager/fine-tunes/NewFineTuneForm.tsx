import useAuthentication from '../account/useAuthentication'
import ErrorMessage from '../components/ErrorMessage'
import SelectEngine from '../components/forms/SelectEngine'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import Select from 'react-select'
import { toast } from 'react-toastify'
import useSWR, { mutate } from 'swr'
import { OpenAI } from '../../../../../../@types/openai'
import Label from '../forms/Label'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'

type Fields = {
  model: string
  training: string
  validation?: string
}

export default function NewFineTuneForm() {
  const { headers } = useAuthentication()
  const navigate = useNavigate()
  const { data, error } = useSWR<OpenAI.List<OpenAI.File>>('files')

  const form = useForm<Fields>({
    defaultValues: { model: 'ada' },
  })

  const files = data?.data
    .filter(file => file.purpose === 'fine-tune')
    .map(file => ({
      label: `${file.filename} (${new Date(
        file.created_at * 1000
      ).toDateString()})`,
      value: file.id,
    }))

  async function onSubmit({ model, training, validation }: Fields) {
    try {
      if (training === validation) {
        throw new Error(
          'You cannot use the same file for training and validation'
        )
      }

      const response = await fetch('https://api.openai.com/v1/fine-tunes', {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...headers },
        body: JSON.stringify({
          model,
          training_file: training,
          validation_file: validation,
        }),
      })
      if (response.ok) {
        await mutate('fine-tune')
        navigate('/fineTuneManager/completions')
        toast.success('Model created!')
      } else {
        const { error } = (await response.json()) as OpenAI.ErrorResponse
        throw new Error(error.message)
      }
    } catch (error) {
      toast.error(String(error))
    }
  }

  return (
    <main className="mx-auto mb-8 space-y-8 max-w-2xl">
      <h1 className="text-3xl">
        Fine Tune <span className="font-normal">Completions Model</span>
      </h1>
      {error && <ErrorMessage error={error} />}
      {data && (
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <fieldset className="space-y-4">
              <Label label="OpenAI Engine">
                <SelectEngine name="model" required />
              </Label>
              <Label label="Training File">
                <Select
                  options={files}
                  {...form.register('training', { required: true })}
                  onChange={selection =>
                    form.setValue('training', selection?.value ?? '')
                  }
                />
              </Label>
              <Label label="Validation File (optional)">
                <Select
                  isClearable
                  escapeClearsValue
                  options={files}
                  {...form.register('model')}
                  onChange={newValue =>
                    form.setValue('validation', newValue?.value)
                  }
                />
              </Label>
            </fieldset>
            <Button disabled={form.formState.isSubmitting} type="submit">
              Create Model
            </Button>
          </form>
        </FormProvider>
      )}
    </main>
  )
}
