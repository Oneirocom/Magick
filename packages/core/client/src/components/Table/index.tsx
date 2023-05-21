import React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
// import TablePagination from './TablePagination'
import TableSortLabel from './TableSortLabel'
import { visuallyHidden } from '@mui/utils'
import styles from './index.module.scss'
import { Box } from '@mui/material'
import Checkbox from '@mui/material/Checkbox'

interface Props {
  rows: any
  column: any
  page?: number
  rowsPerPage?: number
  count?: number
  fieldOrder?: string
  fieldOrderBy?: string
  allowSort?: boolean
  selectedRows: readonly string[]
  setSelected: (row: string[]) => void
  setSortField?: (fueld: string) => void
  setFieldOrder?: (order: string) => void
  handlePageChange?: (e: unknown, newPage: number) => void
  handleRowsPerPageChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}
interface Data {
  calories: number
  carbs: number
  fat: number
  name: string
  protein: number
}

interface HeadCell {
  disablePadding: boolean
  id: keyof Data
  label: string
  align?: 'right'
  minWidth: any
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

type Order = 'asc' | 'desc'

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis.map(el => el[0])
}

interface EnhancedTableProps {
  numSelected: number
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  order: Order
  orderBy: string
  rowCount: number
  columns: HeadCell[]
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    columns,
    onRequestSort,
  } = props
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property)
    }

  return (
    <TableHead>
      <TableRow>
        {columns.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            className={styles.tableCellHeader}
            style={{ minWidth: headCell.minWidth }}
          >
            {(headCell.id as any) === 'checkbox' ? (
              <TableCell padding="checkbox" style={{ borderBottom: 'none' }}>
                <Checkbox
                  color="primary"
                  className={numSelected > 0 ? styles.checkbox : ''}
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={rowCount > 0 && numSelected === rowCount}
                  onChange={onSelectAllClick}
                  inputProps={{
                    'aria-label': 'select all desserts',
                  }}
                />
              </TableCell>
            ) : (headCell.id as any) === 'action' ||
              (headCell.id as any) === 'select' ? (
              <span>{headCell.label} </span>
            ) : (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
                classes={{ icon: styles.spanWhite, active: styles.spanWhite }}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

export const TableComponent = ({
  rows,
  column,
  page,
  rowsPerPage,
  count,
  fieldOrder,
  fieldOrderBy,
  allowSort,
  selectedRows,
  setSortField,
  setFieldOrder,
  setSelected,
  handlePageChange,
  handleRowsPerPageChange,
}: Props) => {
  const [order, setOrder] = React.useState<Order>(
    fieldOrder === 'desc' ? 'desc' : 'asc'
  )
  const [orderBy, setOrderBy] = React.useState<keyof Data>(
    fieldOrderBy ? fieldOrderBy : column[0].id
  )

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setSortField && setSortField(property)
    setFieldOrder && setFieldOrder(order)
    setOrderBy(property)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map(n => n.id || n.row.id)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selectedRows.indexOf(name)
    let newSelected: string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, name)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1))
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1)
      )
    }

    setSelected(newSelected)
  }

  // const handleChangePage = (event: unknown, newPage: number) => {
  //   setPage(newPage)
  // }

  // const handleChangeRowsPerPage = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   setRowsPerPage(parseInt(event.target.value, 10))
  //   setPage(0)
  // }

  const isSelected = (name: string) => selectedRows.indexOf(name) !== -1

  return (
    <React.Fragment>
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
          <EnhancedTableHead
            numSelected={selectedRows.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
            columns={column}
          />
          <TableBody>
            {(allowSort
              ? stableSort(rows, getComparator(order, orderBy))
              : rows
            ).map((row, index) => {
              const isItemSelected = isSelected(row.id || row.row.id)
              const labelId = `enhanced-table-checkbox-${index}`
              return (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ cursor: 'pointer' }}
                  selected={isItemSelected}
                  tabIndex={-1}
                  key={`${index}${row.id || row.row.id}`}
                  onClick={event => handleClick(event, row.id || row.row.id)}
                  aria-checked={isItemSelected}
                  className={isItemSelected ? styles.selectedRow : ''}
                >
                  {column.map((column, index) => {
                    const value = row[column.id]
                    return (
                      <TableCell
                        key={index}
                        align={column.align}
                        className={styles.tableCellBody}
                      >
                        {column.id === 'checkbox' ? (
                          <Checkbox
                            className={isItemSelected ? styles.checkbox : ''}
                            checked={isItemSelected}
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                          />
                        ) : (
                          value
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> */}
    </React.Fragment>
  )
}
