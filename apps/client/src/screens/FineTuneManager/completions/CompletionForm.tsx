import useAuthentication from '../account/useAuthentication'
import Label from '../components/forms/Label'
import SelectEngine, {
  BaseEngines,
  InstructEngines,
} from '../components/forms/SelectEngine'
import InfoCard from '../components/InfoCard'
import ShowRequestExample from '../components/ShowRequestExample'
import React, { useState } from 'react'
import { FormProvider, useForm, useFormContext } from 'react-hook-form'
import CreatableSelect from 'react-select/creatable'
import { toast } from 'react-toastify'
import { OpenAI } from '../../../../../../@types/openai'
import Input from '@mui/material/Input'
import { Button, TextField } from '@mui/material'

export default function CompletionForm({
  fineTune,
}: {
  fineTune?: OpenAI.FineTune
}) {
  const form = useForm({
    defaultValues: {
      engine: fineTune ? undefined : 'davinci',
      model: fineTune ? fineTune.fine_tuned_model : undefined,
      prompt: '',
      max_tokens: 30,
      temperature: 0.8,
      presence_penalty: 0,
      frequency_penalty: 0,
      stop: [] as string[],
    },
  })
  const { headers } = useAuthentication()
  const [results, setResults] = useState<OpenAI.Completions.Response[]>([])

  form.watch()

  const values = form.getValues()
  const request = {
    url: fineTune
      ? `https://api.openai.com/v1/completions`
      : `https://api.openai.com/v1/engines/${
          form.getValues().engine
        }/completions`,
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: {
      model: values.model,
      prompt: values.prompt,
      n: 3,
      temperature: +values.temperature,
      max_tokens: +values.max_tokens,
      presence_penalty: +values.presence_penalty,
      frequency_penalty: +values.frequency_penalty,
      stop: values.stop.length ? values.stop : undefined,
    },
  }

  const onSubmit = form.handleSubmit(async () => {
    const { url, body, ...init } = request
    const response = await fetch(url, { ...init, body: JSON.stringify(body) })
    if (response.ok) {
      const json = await response.json()
      setResults([json, ...results])
    } else {
      const { error } = (await response.json()) as OpenAI.ErrorResponse
      toast.error(error.message)
    }
  })

  return (
    <InfoCard>
      <FormProvider {...form}>
        <form onSubmit={onSubmit} className="space-y-8">
          <fieldset className="md:space-y-4">
            <Label label="Text to complete" required>
              <TextField
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                //   bordered
                minRows={8}
                required
                //   width="100%"
                {...form.register('prompt')}
              />
            </Label>
            {!fineTune && <AdHocOptions />}
            <CommonOptions />
          </fieldset>
          <div>
            <Button
              // auto
              // iconRight={<FontAwesomeIcon icon={faChevronRight} />}
              // loading={form.formState.isSubmitting}
              variant="contained"
              type="submit"
            >
              Complete
            </Button>
          </div>
        </form>
        {results.map((result, index) => (
          <CompletionResults key={index} results={result} />
        ))}
        <ShowRequestExample
          request={request}
          reference="https://beta.openai.com/docs/api-reference/completions/create"
        />
      </FormProvider>
    </InfoCard>
  )
}

function CommonOptions() {
  const form = useFormContext()

  return (
    <div className="flex flex-wrap gap-x-4">
      <Label label="Max tokens">
        <Input
          //   bordered
          type="number"
          min={10}
          max={2048}
          //   step={10}
          {...form.register('max_tokens', { min: 10, max: 2048 })}
        />
      </Label>
      <Label label="Temperature">
        <Input
          //   bordered
          type="number"
          min={0}
          max={1}
          //   step={0.1}
          {...form.register('temperature', { min: 0, max: 1 })}
        />
      </Label>
      <Label label="Presence penalty">
        <Input
          //   bordered
          type="number"
          min={-2}
          max={2}
          //   step={0.1}
          {...form.register('presence_penalty', { min: -2, max: 2 })}
        />
      </Label>
      <Label label="Frequency penalty">
        <Input
          //   bordered
          type="number"
          min={-2}
          max={2}
          //   step={0.1}
          {...form.register('frequency_penalty', { min: -2, max: 2 })}
        />
      </Label>
    </div>
  )
}

function AdHocOptions() {
  const form = useFormContext()

  return (
    <div className="flex flex-wrap gap-x-4">
      <Label label="Engine" required>
        <SelectEngine
          engines={BaseEngines.concat(InstructEngines)}
          name="engine"
          required
        />
      </Label>
      <Label label="Stop sequences">
        <CreatableSelect
          {...form.register('stop')}
          classNamePrefix="react-select"
          isMulti
          onChange={selection =>
            form.setValue(
              'stop',
              selection.map(({ value }) => value)
            )
          }
          options={[] as Array<{ value: string }>}
        />
      </Label>
    </div>
  )
}

function CompletionResults({
  results,
}: {
  results: OpenAI.Completions.Response
}) {
  return (
    <InfoCard>
      <h4 className="my-4">
        <span role="img" aria-label="star">
          ⭐️
        </span>{' '}
        Completions
      </h4>
      <ol className=" list-disc">
        {results.choices.map((choice, index) => (
          <li key={index} className="my-4">
            <p className="line-clamp-4">{choice.text}</p>
          </li>
        ))}
      </ol>
      <p>
        <b>Model:</b> {results.model}
      </p>
    </InfoCard>
  )
}
