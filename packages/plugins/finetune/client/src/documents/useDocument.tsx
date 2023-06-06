import { filesize } from "filesize";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { mutate } from "swr";
import useAuthentication from "../account/useAuthentication";
import { OPENAI_ENDPOINT } from "../constants";
import { OpenAI } from "../types/openai";

export type Enforce = {
    required: string[];
    optional?: string[];
    count: string[];
    maxTokens: number;
  };


export default function useDocument(purpose: string, enforce: Enforce) {
    const { headers } = useAuthentication();
    const all = useAuthentication();
    const [isLoading, setIsLoading] = useState(false);
    const documentLoad = useCallback(
      async function (file: Array<Record<string, string>>) {
        try {
          setIsLoading(true);
          const records = await parseAndValidate(file, enforce);
          const largeRecords = await findLargeRecords(records, enforce);

          if (largeRecords.length > 0) {
            const confirmed = confirmLargeRecords(largeRecords, enforce.maxTokens);
            if (!confirmed) return;
          }
  
          const blob = new Blob([toJSONL(records)], {type: "application/json" });
          const body = new FormData();
          body.append('purpose', purpose);
          body.append('file', blob, "file.name");
          console.log(headers)
          console.log(all)
          const response = await fetch(`${OPENAI_ENDPOINT}/files`, {
            method: 'POST',
            headers,
            body,
          });
          
          if (response.ok) {
            await mutate('files');
            toast.success(
              `Uploaded new ${purpose} file: ${
                records.length
              } records, ${filesize(blob.size)}`
            );
          } else {
            const { error } = (await response.json()) as OpenAI.ErrorResponse;
            toast.error(error.message);
          }
        } catch (error) {
          console.log(error)
          toast.error(String(error));
        } finally {
          setIsLoading(false);
        }
      },
      [enforce, headers, purpose]
    );
  
    return { documentLoad, isLoading };
  }


  function validateRecords(
    records: Array<{ [key: string]: string }>,
    enforce: Enforce
  ) {
    console.log(records)
    if (records.length === 0) throw new Error('No records found');
  
    const allFields = new Set([...enforce.required, ...(enforce.optional ?? [])]);
  
    records.forEach((record) => {
      const hasRequired = enforce.required.every(
        (key) => typeof record[key] === 'string'
      );
      if (!hasRequired)
        throw new Error(
          `Missing required field(s). Expecting: ${enforce.required}`
        );
  
      const onlyAllowed = Object.keys(record).every((key) => allFields.has(key));
      if (!onlyAllowed) throw new Error(`Unknown field(s). Allowed: ${allFields}`);
    });
  }

  async function parseAndValidate(
    records: Array<Record<string, string>>,
    enforce: Enforce
  ): Promise<Array<Record<string, string>>> {
    validateRecords(records, enforce);
    return records;
  }
  
  async function findLargeRecords(
    records: Array<Record<string, string>>,
    enforce: Enforce
  ): Promise<Array<{ row: number; tokens: number }>> {
    const encode = import('../encoder/encoder').then((mod) => mod.default);
  
    const allRows = await Promise.all(
      records
        .map((record) => enforce.count.map((key) => record[key]).join(' '))
        .map(async (text, index) => ({
          row: index + 1,
          tokens: (await encode)(text).length,
        }))
    );
    return allRows.filter(({ tokens }) => tokens > enforce.maxTokens);
  }

  function confirmLargeRecords(
    largeRecords: Array<{ row: number }>,
    maxTokens: number
  ) {
    const rows = largeRecords.map(({ row }) => row).slice(0, 10);
    const message = [
      `This file has ${largeRecords.length} records with more than ${maxTokens} tokens.`,
      `For examples, rows ${rows.join(', ')}.`,
      `These records will not be processed. Continue anyway?`,
    ].join('\n');
  
    return typeof window !== 'undefined' && window.confirm(message);
  }
  const maxFileSize = 150 * 1024 * 1024;
  function toJSONL(records: Array<{ [key: string]: string }>): string {
    const jsonl = records.map((record) => JSON.stringify(record)).join('\n');
    if (jsonl.length > maxFileSize)
      throw new Error(`File too large (max ${filesize(maxFileSize)})`);
    
    return jsonl;
  }