// DOCUMENTED
import { Button } from '@magickml/client-core'
import { API_ROOT_URL } from '@magickml/core'
import {
  Grid,
  IconButton,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import _ from 'lodash'
import { useSnackbar } from 'notistack'
import { useEffect, useMemo, useState } from 'react'
import { CSVLink } from 'react-csv'
import { FaFileCsv } from 'react-icons/fa'
import { VscArrowDown, VscArrowUp, VscTrash } from 'react-icons/vsc'
import {
  Row,
  useAsyncDebounce,
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table'
import { useConfig } from '@magickml/client-core'
import DocumentModal from './DocumentModal'

/**
 * The global filter component for searching documents within the table.
 * @param {object} props - The properties of the component.
 * @returns {JSX.Element} The rendered component.
 */
const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
  // State
  const [value, setValue] = useState(globalFilter)

  // Debounced onChange
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined)
  }, 500)

  return (
    <input
      type="text"
      value={value || ''}
      onChange={e => {
        setValue(e.target.value)
        onChange(e.target.value)
      }}
      placeholder="Search documents..."
      style={{ width: '40em', border: 0, margin: 0 }}
    />
  )
}

/**
 * The default column filter component.
 * @param {object} props - The properties of the component.
 * @returns {JSX.Element} The rendered component.
 */
const DefaultColumnFilter = ({
  column: { filterValue, setFilter, Header },
}) => {
  return (
    <input
      type="text"
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined)
      }}
      placeholder={Header}
      style={{
        width: '100%',
        border: 0,
        margin: 0,
        borderRadius: 0,
      }}
    />
  )
}

/**
 * The document table component for displaying, editing and deleting documents.
 * @param {object} props - The properties of the component.
 * @returns {JSX.Element} The rendered component.
 */
function DocumentTable({ documents, updateCallback }) {
  // Snackbar and configuration context
  const { enqueueSnackbar } = useSnackbar()
  const config = useConfig()

  // Column definition
  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Type',
        accessor: 'type',
      },
      {
        Header: 'Content',
        accessor: 'content',
      },
      {
        Header: 'Project ID',
        accessor: 'projectId',
      },
      {
        Header: 'Date',
        accessor: 'date',
      },
      {
        Header: 'Embedding',
        accessor: 'embedding',
      },
      {
        Header: ' ',
        Cell: row => (
          <IconButton onClick={() => handleDatabaseDelete(row.row.original)}>
            <VscTrash size={16} color="#ffffff" />
          </IconButton>
        ),
      },
    ],
    []
  )

  // Update document in API
  const updateDocument = async ({ id, ...rowData }, columnId, value) => {
    const reqBody = {
      ...rowData,
      [columnId]: value,
      projectId: config.projectId,
    }
    if (!_.isEqual(reqBody, rowData)) {
      const resp = await fetch(`${API_ROOT_URL}/documents/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqBody),
      })

      const json = await resp.json()

      if (json) enqueueSnackbar('Document updated', { variant: 'success' })
      else enqueueSnackbar('Error updating event', { variant: 'error' })
      updateCallback()
    }
  }

  // Editable cell component
  const EditableCell = ({
    value = '',
    row: { original: row },
    column: { id },
    updateDocument,
  }) => {
    const [val, setVal] = useState(value)
    const onChange = e => typeof val !== 'object' && setVal(e.target.value)
    const onBlur = e => updateDocument(row, id, val)
    useEffect(() => setVal(value), [value])
    return (
      <input
        value={
          val && typeof val === 'object'
            ? JSON.stringify((val as { data: unknown }).data)
            : val
        }
        onChange={onChange}
        onBlur={onBlur}
        className="bare-input"
      />
    )
  }

  // Default column properties
  const defaultColumn = {
    Cell: EditableCell,
    Filter: DefaultColumnFilter,
  }

  // Table instance
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    flatRows,
    prepareRow,
    pageOptions,
    gotoPage,
    setGlobalFilter,
    state,
  } = useTable(
    {
      columns,
      data: documents,
      defaultColumn,
      updateDocument,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  ) as any

  // Pagination
  const handlePageChange = (page: number) => {
    const pageIndex = page - 1
    gotoPage(pageIndex)
  }

  // Handle deletion of document
  const handleDatabaseDelete = async (event: any) => {
    const isDeleted = await fetch(`${API_ROOT_URL}/documents/${event.id}`, {
      method: 'DELETE',
    })
    if (isDeleted) {
      enqueueSnackbar('Document deleted', { variant: 'success' })
    } else {
      enqueueSnackbar('Error deleting document', { variant: 'error' })
    }
    updateCallback()
  }

  const originalRows = useMemo(
    () => flatRows.map(row => row.original),
    [flatRows]
  )

  // Create mode state
  const [createMode, setCreateMode] = useState(false)

  // Show create modal
  const showCreateModal = () => {
    setCreateMode(true)
  }

  // Close create modal
  // const closeCreateModal = () => {
  //   setCreateMode(false)
  // }

  // Handle save action
  const handleSave = async () => {
    // call documents endpoint
    // const secrets = localStorage.getItem('secrets')
    const result = await fetch(`${API_ROOT_URL}/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...newDocument,
        projectId: config.projectId,
        // secrets: secrets
      }),
    })

    // reset newDocument
    setNewDocument({
      type: '',
      content: '',
      projectId: '',
      date: '',
      embedding: '',
    })
    updateCallback()

    return result
  }

  // State for new document
  const [newDocument, setNewDocument] = useState({
    type: '',
    content: '',
    projectId: '',
    date: new Date().toISOString(),
    embedding: '',
  })

  return (
    <>
      {createMode && (
        <DocumentModal
          createMode={createMode}
          setCreateMode={setCreateMode}
          handleSave={handleSave}
          setNewDocument={setNewDocument}
        />
      )}
      <Stack spacing={2}>
        <Grid container justifyContent="left" style={{ padding: '1em' }}>
          <GlobalFilter
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
          <Button
            style={{
              display: 'inline',
              backgroundColor: 'purple',
              border: 'none',
              color: 'white',
              marginRight: '.5em',
              marginLeft: 'auto',
            }}
            name="create"
            onClick={showCreateModal}
          >
            Create
          </Button>
          <Button
            style={{
              display: 'inline',
              backgroundColor: 'purple',
              border: 'none',
              color: 'white',
              marginRight: '.5em',
              marginLeft: 'auto',
            }}
            name="refresh"
            onClick={updateCallback}
          >
            Refresh
          </Button>
          <CSVLink
            data={originalRows}
            filename="documents.csv"
            target="_blank"
            style={{
              textDecoration: 'none',
              display: 'inline',
              marginLeft: '.5em',
              marginRight: '.5em',
            }}
          >
            <Button
              style={{
                textDecoration: 'none',
                display: 'inline',
                backgroundColor: 'purple',
                color: 'white',
                border: 'none',
              }}
            >
              <FaFileCsv size={14} />
            </Button>
          </CSVLink>
        </Grid>
        <TableContainer
          component={Paper}
          style={{ width: '100%', padding: 0, margin: 0 }}
        >
          <Table
            style={{ width: '100%', padding: 0, margin: 0 }}
            {...getTableProps()}
          >
            <TableHead
              style={{ backgroundImage: 'none', padding: 0, margin: 0 }}
            >
              {headerGroups.map((headerGroup, idx) => (
                <TableRow
                  {...headerGroup.getHeaderGroupProps()}
                  key={idx}
                  style={{ backgroundImage: 'none', padding: 0, margin: 0 }}
                >
                  {headerGroup.headers.map((column, idx) => (
                    <TableCell
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      style={{
                        fontSize: '0.985rem',
                        padding: '0em',
                        margin: '0em',
                        border: 0,
                      }}
                      key={idx}
                    >
                      <Stack spacing={1}>
                        <div style={{ position: 'relative' }}>
                          {column.canFilter ? column.render('Filter') : null}
                          <span
                            style={{
                              position: 'absolute',
                              top: '.75em',
                              right: '.75em',
                              zIndex: '10',
                            }}
                          >
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <VscArrowDown size={14} />
                              ) : (
                                <VscArrowUp size={14} />
                              )
                            ) : (
                              ''
                            )}
                          </span>
                        </div>
                      </Stack>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody {...getTableBodyProps()}>
              {page.map((row: Row<object>, idx: number) => {
                prepareRow(row)
                return (
                  <TableRow {...row.getRowProps()} key={idx}>
                    {row.cells.map((cell, idx) => (
                      <TableCell {...cell.getCellProps} key={idx}>
                        {cell.render('Cell')}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          count={pageOptions.length}
          onChange={(e, page) => handlePageChange(page)}
          shape="rounded"
          showFirstButton
          showLastButton
        />
      </Stack>
    </>
  )
}

export default DocumentTable
