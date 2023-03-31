// DOCUMENTED 
import { parse } from 'csv-parse';
import { filesize } from 'filesize';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { mutate } from 'swr';
import * as XLSX from 'xlsx';
import useAuthentication from '../account/useAuthentication';
import { OpenAI } from '../types/openai';

import { OPENAI_ENDPOINT } from '../constants';

const maxFileSize = 150 * 1024 * 1024;

/**
 * Supported MIME types for file uploads
 */
export const MimeTypes = [
  'application/jsonl',
  'application/json',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  '.jsonl',
];

/**
 * Enforces validation rules for the uploaded file
 */
export type Enforce = {
  required: string[];
  optional?: string[];
  count: string[];
  maxTokens: number;
};

/**
 * useUploadFile hook, provides the ability to upload and handle files.
 *
 * @param purpose - The purpose of the file being uploaded
 * @param enforce - Enforce certain validation rules for the file
 */
export default function useUploadFile(purpose: string, enforce: Enforce) {
  const { headers } = useAuthentication();
  const [isLoading, setIsLoading] = useState(false);

  const uploadFile = useCallback(
    async function (file: File) {
      try {
        setIsLoading(true);

        const records = await parseAndValidate(file, enforce);
        const largeRecords = await findLargeRecords(records, enforce);

        if (largeRecords.length > 0) {
          const confirmed = confirmLargeRecords(largeRecords, enforce.maxTokens);
          if (!confirmed) return;
        }

        const blob = new Blob([toJSONL(records)], { type: 'application/json' });
        const body = new FormData();
        body.append('purpose', purpose);
        body.append('file', blob, file.name);

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
        toast.error(String(error));
      } finally {
        setIsLoading(false);
      }
    },
    [enforce, headers, purpose]
  );

  return { uploadFile, isLoading };
}

/**
 * Parses and validates an uploaded file.
 *
 * @param file - The uploaded file
 * @param enforce - Enforce certain validation rules for the file
 * @returns Array of records
 */
async function parseAndValidate(
  file: File,
  enforce: Enforce
): Promise<Array<{ [key: string]: string }>> {
  const records = await parseFile(file, enforce);
  validateRecords(records, enforce);

  return records;
}

/**
 * Parses a given file based on its MIME type.
 *
 * @param file - The uploaded file
 * @param enforce - Enforce certain validation rules for the file
 * @returns Array of records
 */
async function parseFile(
  file: File,
  enforce: Enforce
): Promise<Array<{ [key: string]: string }>> {
  const parser = {
      'application/json': parseJSONL,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': parseExcel,
      'text/csv': parseCSV,
    }[file.type] || (file.name.endsWith('.jsonl') && parseJSONL);
  if (!parser) throw new Error(`Unsupported file type ${file.type}`);

  return await parser(file, enforce);
}

/**
 * Parses a JSONL file.
 *
 * @param file - The JSONL file
 * @returns Array of records
 */
async function parseJSONL(file: File) {
  try {
    const text = await file.text();
    const lines = text.split('\n');
    return lines.filter((v) => v !== '').map((line) => JSON.parse(line));
  } catch (error) {
    console.error({ error });
    throw new Error('This is not a JSONL file');
  }
}

/**
 * Parses a CSV file.
 *
 * @param file - The CSV file
 * @returns Array of records
 */
async function parseCSV(file: File): Promise<Array<{ [key: string]: string }>> {
  const text = await file.text();
  return await new Promise((resolve, reject) => {
    parse(text, { columns: true }, (error, data) => {
      if (error) reject(error);
      else resolve(data);
    });
  });
}

/**
 * Parses an Excel file.
 *
 * @param file - The Excel file
 * @param enforce - Enforce certain validation rules for the file
 * @returns Array of records
 */
async function parseExcel(file: File, enforce: Enforce) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'binary' });
  const sheets = workbook.Workbook?.Sheets;
  if (sheets?.length !== 1)
    throw new Error('I can only read Excel documents with one worksheet');

  const sheetName = workbook.SheetNames[0];
  const sheet = sheetName && workbook.Sheets[sheetName];
  if (!sheet) throw new Error('Cannot read this spreadsheet');

  const { s, e } = XLSX.utils.decode_range(sheet['!ref'] ?? 'A1:A1');
  if (s.r === e.r) throw new Error('There are no rows in this spreadsheet');

  if (e.c - s.c + 1 < enforce.required.length)
    throw new Error(
      `There are not enough columns in this spreadsheet (expect ${enforce.required.length})`
    );

  const rows: Array<Record<string, string>> = [];

  for (let r = s.r; r <= e.r; r++) {
    const row: Record<string, string> = {};
    enforce.required.forEach((key, index) => {
      const cell = sheet[XLSX.utils.encode_cell({ r, c: s.c + index })];
      row[key] = cell?.v ?? '';
    });
    rows.push(row);
  }
  return rows;
}

/**
 * Validates records in the file.
 *
 * @param records - The records in the file
 * @param enforce - Enforce certain validation rules for the records
 */
function validateRecords(
  records: Array<{ [key: string]: string }>,
  enforce: Enforce
) {
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

/**
 * Finds records with a large number of tokens.
 *
 * @param records - The records in the file
 * @param enforce - Enforce certain validation rules for the records
 * @returns Array of records containing row and token counts
 */
async function findLargeRecords(
  records: Array<{ [key: string]: string }>,
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

/**
 * Confirms submission of records with a high token count.
 *
 * @param largeRecords - Records with a large number of tokens
 * @param maxTokens - Maximum allowed tokens
 * @returns Confirmation boolean
 */
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

/**
 * Converts records to JSONL format.
 *
 * @param records - The records to convert
 * @returns JSONL string
 */
function toJSONL(records: Array<{ [key: string]: string }>): string {
  const jsonl = records.map((record) => JSON.stringify(record)).join('\n');
  if (jsonl.length > maxFileSize)
    throw new Error(`File too large (max ${filesize(maxFileSize)})`);
  
  return jsonl;
}