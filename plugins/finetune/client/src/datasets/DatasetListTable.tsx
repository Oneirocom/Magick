// DOCUMENTED
/**
 * Imports
 */
import React from 'react'

import ErrorMessage from '../components/ErrorMessage'
import Loading from '../components/Loading'
import DeleteDatasetButton from './DeleteDatasetButton'

import useSWR from 'swr'

import { Table, TableCell } from '@mui/material'

type Dataset = {
  id: number
  name?: string
  projectId?: string
  dataset: string
  openAIFileId?: string
  createdAt: string
}

/**
 * Props interface
 */
interface Props {
  linkTo?: (dataset: Dataset) => string
}

/**
 * DatasetListTable component
 * @param linkTo string [optional] link to dataser
 * @returns JSX element
 */
const DatasetListTable: React.FC<Props> = ({ linkTo }) => {
  /**
   * Fetch the list of datasets from SWR
   */
  const { data: datasets, error } = useSWR('datasets')

  /**
   * Display error
   */
  if (error) return <ErrorMessage error={error} />

  /**
   * Display loading icon
   */
  if (!datasets) return <Loading />
  console.log(datasets)
  /**
   * Display 'No Datasets Uploaded' message
   */
  if (datasets.length === 0) {
    return (
      <div className="my-4">
        <b>No Datasets uploaded</b>
      </div>
    )
  }
  /**
   * Render table of datasets
   */
  return (
    <Table>
      {datasets.data.map((dataset: Dataset, index: number) => {
        const datasetName = dataset.name ?? 'Untitled Dataset'
        return (
          <tr className={index % 2 === 0 ? 'bg-gray-100' : ''} key={dataset.id}>
            <TableCell className="p-2 max-w-0 truncate" title={datasetName}>
              {/* {linkTo ? (
                  <a href={linkTo(file)}>
                    <span>{dataset.id}</span>
                  </a>
                ) : (
                  <span>{dataset.id}</span>
                )} */}
            </TableCell>
            <TableCell className="p-2 max-w-0 truncate" title={datasetName}>
              <span>{datasetName}</span>
            </TableCell>
            <TableCell
              className="p-2 max-w-0 truncate"
              title={new Date(dataset.createdAt).toISOString()}
            >
              {new Date(dataset.createdAt).toLocaleString()}
            </TableCell>
            <TableCell className="p-2 w-8">
              <DeleteDatasetButton id={dataset.id} />
            </TableCell>
          </tr>
        )
      })}
    </Table>
  )
}

/**
 * Exports
 */
export default DatasetListTable
