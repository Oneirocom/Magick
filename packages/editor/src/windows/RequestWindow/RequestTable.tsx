// DOCUMENTED 
import { Button } from '@magickml/client-core';
import { API_ROOT_URL } from '@magickml/core';
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
  TableRow
} from '@mui/material';
import _ from 'lodash';
import { useSnackbar } from 'notistack';
import { useEffect, useMemo, useState } from 'react';
import { CSVLink } from 'react-csv';
import { FaFileCsv } from 'react-icons/fa';
import { VscArrowDown, VscArrowUp, VscTrash } from 'react-icons/vsc';
import {
  Row,
  useAsyncDebounce,
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable
} from 'react-table';
import { useConfig } from '@magickml/client-core';

/**
 * GlobalFilter component.
 * Filter the table data using a global search input.
 */
const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 500);
  return (
    <input
      type="text"
      value={value || ''}
      onChange={(e) => {
        setValue(e.target.value);
        onChange(e.target.value);
      }}
      placeholder="Search requests..."
      style={{ width: '40em', border: 0, margin: 0 }}
    />
  );
};

/**
 * DefaultColumnFilter component.
 * Filter the table data using a column search input.
 */
const DefaultColumnFilter = ({ column: { filterValue, setFilter, Header } }) => {
  return (
    <input
      type="text"
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      placeholder={Header}
      style={{ width: '100%', border: 0, margin: 0, borderRadius: 0 }}
    />
  );
};

/**
 * RequestTable component.
 * Displays a table of requests with sorting, filtering, and pagination.
 */
function RequestTable({ requests, updateCallback }) {
  const { enqueueSnackbar } = useSnackbar();
  const config = useConfig();

  // Columns configuration for the table
  const columns = useMemo(
    () => [
      { Header: 'Provider', accessor: 'provider' },
      { Header: 'Type', accessor: 'type' },
      { Header: 'Node ID', accessor: 'nodeId' },
      {
        Header: 'Cost',
        accessor: 'cost',
        Cell: (obj) => '$' + obj.value.toFixed(7)
      },
      { Header: 'Req Time', accessor: 'duration' },
      { Header: 'Status', accessor: 'status' },
      { Header: 'Code', accessor: 'statusCode' },
      { Header: 'Model', accessor: 'model' },
      { Header: 'Req Data', accessor: 'requestData' },
      { Header: 'Res Data', accessor: 'responseData' },
      { Header: 'Parameters', accessor: 'parameters' },
      { Header: 'Spell', accessor: 'currentSpell' },
      {
        Header: ' ',
        Cell: (row) => (
          <IconButton onClick={() => handleRequestDelete(row.row.original)}>
            <VscTrash size={16} color="#ffffff" />
          </IconButton>
        )
      }
    ],
    []
  );

  // Update request with the new data
  const updateRequest = async ({ id, ...rowData }, columnId, value) => {
    const reqBody = {
      ...rowData,
      [columnId]: value,
      projectId: config.projectId
    };
    if (!_.isEqual(reqBody, rowData)) {
      const resp = await fetch(`${API_ROOT_URL}/request/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqBody)
      });

      const json = await resp.json();

      if (json) enqueueSnackbar('Request updated', { variant: 'success' });
      else enqueueSnackbar('Error updating event', { variant: 'error' });
      updateCallback();
    }
  };

  // EditableCell component for inline editing of table cells
  const EditableCell = ({ value = '', row: { original: row }, column: { id }, updateRequest }) => {
    const [val, setVal] = useState(value);
    const onChange = (e) => typeof val !== 'object' && setVal(e.target.value);
    const onBlur = (e) => updateRequest(row, id, val);
    useEffect(() => setVal(value), [value]);
    return (
      <input
        value={val && typeof val === 'object' ? JSON.stringify(val.data) : val}
        onChange={onChange}
        onBlur={onBlur}
        className="bare-input"
      />
    );
  };

  const defaultColumn = {
    Cell: EditableCell,
    Filter: DefaultColumnFilter
  };

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
    state
  } = useTable(
    {
      columns,
      data: requests,
      defaultColumn,
      updateRequest
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  ) as any;

  // Handle page change
  const handlePageChange = (page: number) => {
    const pageIndex = page - 1;
    gotoPage(pageIndex);
  };

  // Handle request deletion
  const handleRequestDelete = async (event: any) => {
    const resp = await fetch(`${API_ROOT_URL}/request/${event.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.token}` },
      body: JSON.stringify({ hidden: true })
    });

    const json = await resp.json();

    if (json) enqueueSnackbar('Request deleted', { variant: 'success' });
    else enqueueSnackbar('Error deleting Request', { variant: 'error' });
    updateCallback();
  };

  // Generate original rows data for CSV export
  const originalRows = useMemo(() => flatRows.map((row) => row.original), [flatRows]);

  return (
    <Stack spacing={2}>
      <Grid container justifyContent="left" style={{ padding: '1em' }}>
        <GlobalFilter globalFilter={state.globalFilter} setGlobalFilter={setGlobalFilter} />
        <Button
          style={{
            display: 'inline',
            backgroundColor: 'purple',
            border: 'none',
            color: 'white',
            marginRight: '.5em',
            marginLeft: 'auto'
          }}
          name="refresh"
          onClick={updateCallback}
        >
          Refresh
        </Button>
        <CSVLink
          data={originalRows}
          filename="requests.csv"
          target="_blank"
          style={{ textDecoration: 'none', display: 'inline', marginLeft: '.5em', marginRight: '.5em' }}
        >
          <Button
            style={{ textDecoration: 'none', display: 'inline', backgroundColor: 'purple', color: 'white', border: 'none' }}
          >
            <FaFileCsv size={14} />
          </Button>
        </CSVLink>
      </Grid>
      <TableContainer component={Paper} style={{ width: '100%', padding: 0, margin: 0 }}>
        <Table style={{ width: '100%', padding: 0, margin: 0 }} {...getTableProps()}>
          <TableHead style={{ backgroundImage: 'none', padding: 0, margin: 0 }}>
            {headerGroups.map((headerGroup, idx) => (
              <TableRow {...headerGroup.getHeaderGroupProps()} key={idx} style={{ backgroundImage: 'none', padding: 0, margin: 0 }}>
                {headerGroup.headers.map((column, idx) => (
                  <TableCell
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    style={{ fontSize: '0.985rem', padding: '0em', margin: '0em', border: 0 }}
                    key={idx}
                  >
                    <Stack spacing={1}>
                      <div style={{ position: 'relative' }}>
                        {column.canFilter ? column.render('Filter') : null}
                        <span style={{ position: 'absolute', top: '.75em', right: '.75em', zIndex: '10' }}>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? <VscArrowDown size={14} />
                              : <VscArrowUp size={14} />
                            : ''}
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
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()} key={idx}>
                  {row.cells.map((cell, idx) => (
                    <TableCell {...cell.getCellProps} key={idx}>
                      {cell.render('Cell')}
                    </TableCell>
                  ))}
                </TableRow>
              );
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
  );
}

export default RequestTable;