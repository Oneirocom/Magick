// GENERATED 
/**
 * Imports
 */
import { parse } from 'csv-parse';
import useSWRImmutable from 'swr/immutable';
import useAuthentication from '../account/useAuthentication';
import { ResultFileRecord } from './FineTuneResultsCard';

import { OPENAI_ENDPOINT } from '../constants';

/**
 * useFineTuneResults function
 * @param fileId string The ID of the fine-tune result file
 * @returns { error?: Error, results?: ResultFileRecord[] } Results and errors of the file
 */
export default function useFineTuneResults(fileId?: string): { error?: Error, results?: ResultFileRecord[] } {
  /**
   * Authentication headers
   */
  const { headers } = useAuthentication();

  /**
   * Fetching results from the fine tune result file
   */
  const { data: results, error } = useSWRImmutable<ResultFileRecord[]>(
    fileId ? `files/${fileId}/content` : null,
    async resource => {
      const response = await fetch(`${OPENAI_ENDPOINT}/${resource}`, {
        headers,
      });
      if (!response.ok) throw new Error(response.statusText);

      /**
       * Parsing the response data
       */
      const raw = await response.text();
      return new Promise((resolve, reject) => {
        parse(
          raw,
          { cast: true, columns: true, skip_empty_lines: true },
          (error, data) => {
            if (error) return reject(error);
            else resolve(data);
          }
        );
      });
    }
  );

  return { results, error };
}
