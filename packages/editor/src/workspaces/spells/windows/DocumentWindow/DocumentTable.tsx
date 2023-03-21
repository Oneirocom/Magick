import { useEffect, useMemo, useState } from 'react'
import {
  useAsyncDebounce,
  useGlobalFilter,
  useFilters,
  usePagination,
  useSortBy,
  useTable,
  Row,
} from 'react-table'
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Pagination,
  Stack,
  IconButton,
  Grid,
  TextField,
} from '@mui/material'
import { v4 as uuidv4 } from 'uuid'

import { Modal } from '@magickml/client-core'

import { VscArrowDown, VscArrowUp, VscTrash } from 'react-icons/vsc'
import { FaFileCsv } from 'react-icons/fa'
import { useSnackbar } from 'notistack'
import _ from 'lodash'
import { CSVLink } from 'react-csv'
import { useConfig } from '../../../../contexts/ConfigProvider'
import { Button } from '@magickml/client-core'
import { API_ROOT_URL } from '@magickml/engine'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
  const [value, setValue] = useState(globalFilter)
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

function DocumentTable({ documents, updateCallback }) {
  const { enqueueSnackbar } = useSnackbar()
  const config = useConfig()

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
        Header: 'Owner',
        accessor: 'owner',
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
        value={val && typeof val === 'object' ? JSON.stringify(val.data) : val}
        onChange={onChange}
        onBlur={onBlur}
        className="bare-input"
      />
    )
  }

  const defaultColumn = {
    Cell: EditableCell,
    Filter: DefaultColumnFilter,
  }

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

  const handlePageChange = (page: number) => {
    const pageIndex = page - 1
    gotoPage(pageIndex)
  }

  const handleDatabaseDelete = async (event: any) => {
    const isDeleted = await fetch(`${API_ROOT_URL}/documents/${event.id}`, {
      method: 'DELETE',
    })
    if (isDeleted) enqueueSnackbar('Document deleted', { variant: 'success' })
    else enqueueSnackbar('Error deleting document', { variant: 'error' })
    updateCallback()
  }

  const originalRows = useMemo(
    () => flatRows.map(row => row.original),
    [flatRows]
  )

  const [createMode, setCreateMode] = useState(false)

  const showCreateModal = () => {
    setCreateMode(true)
  }

  const handleSave = async () => {
    console.log('saving', newDocument)
    // call documents endpoint, post to fetch
    const result = await fetch(`${API_ROOT_URL}/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...newDocument,
        projectId: config.projectId,
      }),
    })
    // reset newDocument
    setNewDocument({
      type: '',
      owner: '',
      content: '',
      projectId: '',
      date: '',
      embedding: '',
    })
    updateCallback()
    console.log('result', result)
    return result
  }

  const [newDocument, setNewDocument] = useState({
    type: '',
    owner: '',
    content: '',
    projectId: '',
    date: new Date().toISOString(),
    embedding: '',
  })

  return (
    <>
      {createMode && (
        <Modal
          open={createMode}
          setOpen={setCreateMode}
          handleAction={handleSave}
        >
          <TextField
            label="Type"
            name="type"
            style={{ width: '100%', margin: '.5em' }}
            onChange={e =>
              setNewDocument({ ...newDocument, type: e.target.value })
            }
          />
          <TextField
            label="Owner"
            name="owner"
            style={{ width: '100%', margin: '.5em' }}
            onChange={e =>
              setNewDocument({ ...newDocument, owner: e.target.value })
            }
          />
          <TextField
            label="Content"
            name="content"
            style={{ width: '100%', margin: '.5em' }}
            onChange={e =>
              setNewDocument({ ...newDocument, content: e.target.value })
            }
          />
          <DatePicker
            label="Date"
            onChange={date => setNewDocument({ ...newDocument, date: date.toISOString() })}
          />
          <TextField
            label="Embedding"
            name="embedding"
            style={{ width: '100%', margin: '.5em' }}
            onChange={e =>
              setNewDocument({ ...newDocument, embedding: e.target.value })
            }
          />
        </Modal>
      )}
      <Stack spacing={2}>
        <Grid container justifyContent="left" style={{ padding: '1em' }}>
          <GlobalFilter
            globalFilter={(state as any).globalFilter} // typing is wrong for this?
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
