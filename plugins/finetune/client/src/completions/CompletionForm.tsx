// DOCUMENTED 
import useAuthentication from '../account/useAuthentication';
import InfoCard from '../components/InfoCard';
import ShowRequestExample from '../components/ShowRequestExample';
import React, { useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';
import { OpenAI } from '../types/openai';
import { Box, Button, TextField } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { OPENAI_ENDPOINT } from '../constants';

/**
 * CompletionForm component.
 * @param {object} props - Component props.
 * @param {OpenAI.FineTune | undefined} props.fineTune - Fine-tuning object.
 * @returns {JSX.Element}
 */
export default function CompletionForm({
  fineTune,
}: {
  fineTune?: OpenAI.FineTune;
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
  });

  const { headers } = useAuthentication();
  const [results, setResults] = useState<OpenAI.Completions.Response[]>([]);

  form.watch();

  const values = form.getValues();
  const request = {
    url: fineTune
      ? `${OPENAI_ENDPOINT}/completions`
      : `${OPENAI_ENDPOINT}/engines/${form.getValues().engine}/completions`,
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
  };

  /**
   * Handles form submission.
   */
  const onSubmit = form.handleSubmit(async () => {
    const { url, body, ...init } = request;
    const response = await fetch(url, { ...init, body: JSON.stringify(body) });
    if (response.ok) {
      const json = await response.json();
      setResults([json, ...results]);
    } else {
      const { error } = (await response.json()) as OpenAI.ErrorResponse;
      toast.error(error.message);
    }
  });

  return (
    <>
      <InfoCard>
        <FormProvider {...form}>
          <form onSubmit={onSubmit}>
            <fieldset style={{ border: 'none' }}>
              <TextField
                label="Prompt"
                autoFocus
                required
                multiline
                rows={2}
                sx={{ width: '100%' }}
                {...form.register('prompt')}
              />
              <CommonOptions />
            </fieldset>
            <Box
              component={'div'}
              sx={{ display: 'flex', justifyContent: 'flex-end', padding: 1 }}
            >
              <Button
                variant="contained"
                type="submit"
                endIcon={<ChevronRightIcon />}
              >
                Complete
              </Button>
            </Box>
          </form>
          {results.map((result, index) => (
            <CompletionResults key={index} results={result} />
          ))}
        </FormProvider>
      </InfoCard>
      <InfoCard>
        <ShowRequestExample
          request={request}
          reference="https://beta.openai.com/docs/api-reference/completions/create"
        />
      </InfoCard>
    </>
  );
}

/**
 * CommonOptions component.
 * @returns {JSX.Element}
 */
function CommonOptions() {
  const form = useFormContext();

  return (
    <Box
      component={'div'}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        padding: 2,
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <TextField
        label="Max tokens"
        type="number"
        min={10}
        max={2048}
        inputProps={{
          step: 10,
        }}
        {...form.register('max_tokens', { min: 10, max: 2048 })}
      />
      <TextField
        label="Temperature"
        type="number"
        min={0}
        max={1}
        inputProps={{
          step: 0.1,
        }}
        {...form.register('temperature', { min: 0, max: 1 })}
      />
      <TextField
        label="Presence penalty"
        type="number"
        min={-2}
        max={2}
        inputProps={{
          step: 0.1,
        }}
        {...form.register('presence_penalty', { min: -2, max: 2 })}
      />
      <TextField
        label="Frequency penalty"
        type="number"
        min={-2}
        max={2}
        inputProps={{
          step: 0.1,
        }}
        {...form.register('frequency_penalty', { min: -2, max: 2 })}
      />
    </Box>
  );
}

/**
 * CompletionResults component.
 * @param {object} props - Component props.
 * @param {OpenAI.Completions.Response} props.results - Completion results.
 * @returns {JSX.Element}
 */
function CompletionResults({
  results,
}: {
  results: OpenAI.Completions.Response;
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
  );
}