import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'

import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@magickml/ui'

export interface DataTablePaginationProps<TData> {
  table: Table<TData>
  pageSizes?: number[]
  labels?: {
    rowsPerPage?: string
    of?: string
    page?: string
    selected?: string
    row?: string
    rows?: string
  }
  onPageChange?: (pageIndex: number) => void
  onPageSizeChange?: (pageSize: number) => void
}

export function DataTablePagination<TData>({
  table,
  pageSizes = [10, 20, 30, 40, 50],
  labels = {
    rowsPerPage: 'Rows per page',
    of: 'of',
    page: 'Page',
    selected: 'selected',
    row: 'row',
    rows: 'rows',
  },
  onPageChange,
  onPageSizeChange,
}: DataTablePaginationProps<TData>) {
  const handlePageChange = (pageIndex: number) => {
    table.setPageIndex(pageIndex)
    onPageChange?.(pageIndex)
  }

  const handlePageSizeChange = (pageSize: number) => {
    table.setPageSize(pageSize)
    onPageSizeChange?.(pageSize)
  }

  return (
    <div className="flex items-center justify-between px-2 text-white">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} {labels.of}{' '}
        {table.getFilteredRowModel().rows.length} {labels.selected} {labels.row}
        (s).
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">{labels.rowsPerPage}</span>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={value => {
              handlePageSizeChange(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizes.map(size => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          {labels.page} {table.getState().pagination.pageIndex + 1} {labels.of}{' '}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
