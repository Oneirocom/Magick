// DOCUMENTED 
import { parse } from 'csv-parse';
import useSWRImmutable from 'swr/immutable';
import useAuthentication from '../account/useAuthentication';
import { ResultFileRecord } from './FineTuneResultsCard';

import { OPENAI_ENDPOINT } from '../constants';

/**
 * Custom hook for fetching and parsing fine-tuned results.
 *
 * @param fileId - The ID of the file to fetch results for.
 * @returns An object containing an optional error and an array of ResultFileRecords.
 */
export default function useFineTuneResults(
  fileId?: string,
): { error?: Error; results?: ResultFileRecord[] } {
  // Get authentication headers
  const { headers } = useAuthentication();

  // Fetch and parse data using SWRImmutable
  const { data: results, error } = useSWRImmutable<ResultFileRecord[]>(
    fileId ? `files/${fileId}/content` : null,
    async (resource) => {
      // Fetch data using authenticated request
      const response = await fetch(`${OPENAI_ENDPOINT}/${resource}`, {
        headers,
      });

      // Handle non-OK responses
      if (!response.ok) throw new Error(response.statusText);

      // Get the raw CSV text
      const raw = await response.text();

      // Parse CSV text using csv-parse library
      return new Promise((resolve, reject) => {
        parse(
          raw,
          { cast: true, columns: true, skip_empty_lines: true },
          (error, data) => {
            if (error) return reject(error);
            else resolve(data);
          },
        );
      });
    },
  );

  // Return results and error
  return { results, error };
}
