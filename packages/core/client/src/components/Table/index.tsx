import React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TablePagination from './TablePagination'
import TableSortLabel from './TableSortLabel'

import styles from './index.module.scss'

interface Props {
  rows: any
  column: any
  page?: number
  rowsPerPage?: number
  count?: number
  fieldOrder?: string
  fieldOrderBy?: string
  allowSort?: boolean
  setSortField?: (fueld: string) => void
  setFieldOrder?: (order: string) => void
  handlePageChange?: (e: unknown, newPage: number) => void
  handleRowsPerPageChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}
type Order = 'asc' | 'desc'

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
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void
  order: Order
  orderBy: string
  rowCount: number
  columns: HeadCell[]
}

const EnhancedTableHead = ({
  order,
  orderBy,
  onRequestSort,
  columns,
}: EnhancedTableProps) => {
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
            {(headCell.id as any) === 'action' ||
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
                {/* {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null} */}
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
  setSortField,
  setFieldOrder,
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

  return (
    <React.Fragment>
      <TableContainer className={styles.tableContainer}>
        <Table stickyHeader aria-label="sticky table">
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
            columns={column}
          />
          <TableBody>
            {(allowSort
              ? stableSort(rows, getComparator(order, orderBy))
              : rows
            ).map((row, index) => {
              return (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={`${index}${row.name}`}
                >
                  {column.map((column, index) => {
                    const value = row[column.id]
                    return (
                      <TableCell
                        key={index}
                        align={column.align}
                        className={styles.tableCellBody}
                      >
                        {value}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {rowsPerPage && page && (
        <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          className={styles.tableFooter}
          showFirstButton
          showLastButton
        />
      )}
    </React.Fragment>
  )
}

export default TableComponent
