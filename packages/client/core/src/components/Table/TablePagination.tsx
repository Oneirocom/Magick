import {
  TablePagination as MuiTablePagination,
  TablePaginationProps,
} from '@mui/material'

const TablePagination = (
  props: TablePaginationProps & { component?: string }
) => <MuiTablePagination {...props} />

TablePagination.displayName = 'TablePagination'

TablePagination.defaultProps = {
  count: 100,
  onPageChange: () => {},
  page: 1,
  rowsPerPage: 10,
}

export default TablePagination
