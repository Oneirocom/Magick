// DOCUMENTED 
/**
 * Imports
 */
import React from 'react';

import ErrorMessage from '../components/ErrorMessage';
import Loading from '../components/Loading';
import DeleteFileButton from './DeleteFileButton';

import useSWR from 'swr';

import { OpenAI } from '../types/openai';

import { Table, TableCell } from '@mui/material';

/**
 * Props interface
 */
interface Props {
  linkTo?: (file: OpenAI.File) => string;
  purpose: OpenAI.Purpose;
}

/**
 * FileListTable component
 * @param linkTo string [optional] link to file
 * @param purpose string type of purpose
 * @returns JSX element
 */
const FileListTable: React.FC<Props> = ({ linkTo, purpose }) => {
  /**
   * Fetch the list of files from SWR
   */
  const { data, error } = useSWR<OpenAI.List<OpenAI.File>>('files');

  /**
   * Display error
   */
  if (error) return <ErrorMessage error={error} />;

  /**
   * Display loading icon
   */
  if (!data) return <Loading />;

  /**
   * Filter files by purpose
   */
  const files = data.data.filter((file: OpenAI.File) => file.purpose === purpose);

  /**
   * Display 'No Files Uploaded' message
   */
  if (files.length === 0) {
    return (
      <div className="my-4">
        <b>No files uploaded</b>
      </div>
    );
  }

  /**
   * Render table of files
   */
  return (
    <Table>
      {files
        .sort((a, b) => b.createdAt - a.createdAt)
        .map((file: OpenAI.File, index: number) => (
          <tr className={index % 2 === 0 ? 'bg-gray-100' : ''} key={file.id}>
            <TableCell className="p-2 max-w-0 truncate" title={file.id}>
              {
                linkTo
                  ? (
                    <a href={linkTo(file)}>
                      <span>{file.id}</span>
                    </a>
                    )
                  : (
                    <span>{file.id}</span>
                    )
              }
            </TableCell>
            <TableCell className="p-2 max-w-0 truncate" title={file.filename}>
              <span>{file.filename}</span>
            </TableCell>
            <TableCell className="p-2 max-w-0 truncate" title={new Date(file.createdAt * 1000).toISOString()}>
              {new Date(file.createdAt * 1000).toLocaleString()}
            </TableCell>
            <TableCell className="p-2 w-8">
              <DeleteFileButton id={file.id} />
            </TableCell>
          </tr>
        ))}
    </Table>
  );
};

/**
 * Exports
 */
export default FileListTable;