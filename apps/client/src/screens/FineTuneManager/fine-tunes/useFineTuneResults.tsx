import useAuthentication from "components/account/useAuthentication";
import { parse } from "csv-parse";
import useSWRImmutable from "swr/immutable";
import { ResultFileRecord } from "./FineTuneResultsCard";

export default function useFineTuneResults(fileId?: string): {
  error?: Error;
  results?: ResultFileRecord[];
} {
  const { headers } = useAuthentication();

  const { data: results, error } = useSWRImmutable<ResultFileRecord[]>(
    fileId ? `files/${fileId}/content` : null,
    async (resource) => {
      const response = await fetch(`https://api.openai.com/v1/${resource}`, {
        headers,
      });
      if (!response.ok) throw new Error(response.statusText);
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
