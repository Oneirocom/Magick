import {
  TableSortLabel as MuiTableSortLabel,
  TableSortLabelProps,
} from '@mui/material'

const TableSortLabel = ({ children, ...props }: TableSortLabelProps) => (
  <MuiTableSortLabel {...props}>{children}</MuiTableSortLabel>
)

TableSortLabel.displayName = 'TableSortLabel'

TableSortLabel.defaultProps = {
  children: null,
}

export default TableSortLabel
