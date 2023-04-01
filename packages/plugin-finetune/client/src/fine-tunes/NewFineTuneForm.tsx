// DOCUMENTED 
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
import useSWR, { mutate } from 'swr';
import useAuthentication from '../account/useAuthentication';
import ErrorMessage from '../components/ErrorMessage';
import SelectEngine from '../components/forms/SelectEngine';
import InfoCard from '../components/InfoCard';
import Label from '../forms/Label';
import { OpenAI } from '../types/openai';

import { OPENAI_ENDPOINT } from '../constants';

/**
 * Type for form fields.
 */
type Fields = {
  model: string;
  training: string;
  validation?: string;
};

/**
 * New fine-tune form component.
 * @returns The new fine-tune form.
 */
export default function NewFineTuneForm() {
  const { headers } = useAuthentication();
  const navigate = useNavigate();
  const { data, error } = useSWR<OpenAI.List<OpenAI.File>>('files');

  const form = useForm<Fields>({
    defaultValues: { model: 'ada' },
  });

  const files = data?.data
    .filter(file => file.purpose === 'fine-tune')
    .map(file => ({
      label: `${file.filename} (${new Date(
        file.createdAt * 1000
      ).toDateString()})`,
      value: file.id,
    }));

  /**
   * Handles form submission.
   * @param {Fields} param0 Form fields.
   */
  async function onSubmit({ model, training, validation }: Fields) {
    try {
      if (training === validation) {
        throw new Error(
          'You cannot use the same file for training and validation'
        );
      }

      const response = await fetch(`${OPENAI_ENDPOINT}/fine-tunes`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...headers },
        body: JSON.stringify({
          model,
          training_file: training,
          validation_file: validation,
        }),
      });
      if (response.ok) {
        await mutate('fine-tune');
        navigate('/fineTuneManager/completions');
        toast.success('Model created!');
      } else {
        const { error } = (await response.json()) as OpenAI.ErrorResponse;
        throw new Error(error.message);
      }
    } catch (error) {
      toast.error(String(error));
    }
  }

  return (
    <main className="mx-auto mb-8 space-y-8 max-w-2xl">
      <Box component={'span'} sx={{ textAlign: 'center' }}>
        {/* TODO @thomageanderson: remove hardcoded color when global mui themes are supported */}
        <Typography variant="h4" component="h2" color="white">
          Fine Tune Completions Model
        </Typography>
      </Box>
      {error && <ErrorMessage error={error} />}
      {data && (
        <InfoCard>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Label label="OpenAI Engine">
                <SelectEngine name="model" required />
              </Label>
              <Label label="Training File">
                <Select
                  styles={{
                    option: styles => {
                      return {
                        ...styles,
                        color: 'black',
                      };
                    },
                  }}
                  options={files}
                  {...form.register('training', { required: true })}
                  onChange={selection =>
                    form.setValue('training', selection?.value ?? '')
                  }
                />
              </Label>
              <Label label="Validation File (optional)">
                <Select
                  styles={{
                    option: styles => {
                      return {
                        ...styles,
                        color: 'black',
                      };
                    },
                  }}
                  isClearable
                  escapeClearsValue
                  options={files}
                  {...form.register('model')}
                  onChange={newValue =>
                    form.setValue('validation', newValue?.value)
                  }
                />
              </Label>
              <Box
                component={'div'}
                sx={{ display: 'flex', justifyContent: 'flex-end', padding: 1 }}
              >
                <Button
                  disabled={form.formState.isSubmitting}
                  type="submit"
                  variant="contained"
                  endIcon={<ChevronRightIcon />}
                >
                  Create Model
                </Button>
              </Box>
            </form>
          </FormProvider>
        </InfoCard>
      )}
    </main>
  );
}