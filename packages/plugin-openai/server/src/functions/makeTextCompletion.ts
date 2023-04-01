// DOCUMENTED 
import { CompletionHandlerInputData, saveRequest } from '@magickml/engine';
import axios from 'axios';
import { OPENAI_ENDPOINT } from '../constants';

/**
 * Makes an API request to an AI text completion service.
 *
 * @param {CompletionHandlerInputData} data - The input data for the completion API.
 * @returns {Promise<{success: boolean, result?: string | null, error?: string | null}>} - A Promise resolving to the result of the completion API call.
 */
export async function makeTextCompletion(
  data: CompletionHandlerInputData
): Promise<{
  success: boolean;
  result?: string | null;
  error?: string | null;
}> {
  // Destructure necessary properties from the data object.
  const { node, inputs, context } = data;
  const { projectId, currentSpell } = context;

  // Set the current spell for record keeping.
  const spell = currentSpell;

  // Get the input text prompt.
  const prompt = inputs['input'][0];

  // Get the settings object, setting default values if necessary.
  const settings = ((inputs.settings && inputs.settings[0]) ?? {
    model: node?.data?.model,
    temperature: node?.data?.temperature,
    max_tokens: node?.data?.max_tokens,
    top_p: node?.data?.top_p,
    frequency_penalty: node?.data?.frequency_penalty,
    presence_penalty: node?.data?.presence_penalty,
    stop: node?.data?.stop,
  }) as any;

  // Add the prompt to the settings object.
  settings.prompt = prompt;

  // Set up headers for the API request.
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + context.module.secrets['openai_api_key'],
  };

  // Make the API request and handle the response.
  try {
    const start = Date.now();
    const resp = await axios.post(`${OPENAI_ENDPOINT}/completions`, settings, {
      headers: headers,
    });

    const usage = resp.data.usage;

    // Save the request data for future reference.
    saveRequest({
      projectId: projectId,
      requestData: JSON.stringify(settings),
      responseData: JSON.stringify(resp.data),
      startTime: start,
      statusCode: resp.status,
      status: resp.statusText,
      model: settings.model,
      parameters: JSON.stringify(settings),
      type: 'completion',
      provider: 'openai',
      totalTokens: usage.total_tokens,
      hidden: false,
      processed: false,
      spell,
      nodeId: node.id as number,
    });

    // Check if choices array is not empty, then return the result.
    if (resp.data.choices && resp.data.choices.length > 0) {
      const choice = resp.data.choices[0];
      console.log('choice', choice);
      return { success: true, result: choice.text };
    }
    // If no choices were returned, return an error.
    return { success: false, error: 'No choices returned' };
  } catch (err: any) {
    console.error(err);
    return { success: false, error: err.message };
  }
}