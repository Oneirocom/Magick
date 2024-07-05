'use client'
import * as React from 'react'
import {
  ChevronDownIcon,
  DotsHorizontalIcon,
  TrashIcon,
} from '@radix-ui/react-icons'
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Button,
  ButtonProps,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  InputProps,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../core/ui'
import { FancyInput } from '../../../fancy'
import { SetStateAction } from 'react'
import { Loader } from '@magickml/embedder-schemas'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onDelete?: (row: TData[]) => void
  tableProps?: React.HTMLAttributes<HTMLTableElement>
  tableHeaderProps?: React.HTMLAttributes<HTMLTableSectionElement>
  tableBodyProps?: React.HTMLAttributes<HTMLTableSectionElement>
  tableRowProps?: React.HTMLAttributes<HTMLTableRowElement>
  tableCellProps?: React.TdHTMLAttributes<HTMLTableCellElement>
  tableHeadProps?: React.ThHTMLAttributes<HTMLTableCellElement>
  filterInputProps?: InputProps
  filterInputPlaceholder?: string
  columnVisibilityButtonProps?: ButtonProps
  previousButtonProps?: ButtonProps
  nextButtonProps?: ButtonProps
  pageCountDivProps?: React.HTMLAttributes<HTMLDivElement>
  paginationDivProps?: React.HTMLAttributes<HTMLDivElement>
  renderRowActionMenu?: (row: Row<TData>) => React.ReactNode
  handleDeleteSelected?: (selectedRows: Loader[]) => Promise<void>
  rowSelection?: Record<string, boolean>
  setRowSelection?: React.Dispatch<SetStateAction<{}>>
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onDelete,
  handleDeleteSelected,
  rowSelection,
  setRowSelection,
  tableProps,
  tableHeaderProps,
  tableBodyProps,
  tableRowProps,
  tableCellProps,
  tableHeadProps,
  filterInputProps,
  filterInputPlaceholder = 'Filter...',
  columnVisibilityButtonProps,
  previousButtonProps,
  nextButtonProps,
  pageCountDivProps,
  paginationDivProps,
  renderRowActionMenu,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})

  const [{ pageIndex, pageSize }, setPagination] = React.useState<{
    pageIndex: number
    pageSize: number
  }>({
    pageIndex: 0,
    pageSize: 10,
  })

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    // manualPagination: true,
    pageCount: Math.ceil(data.length / pageSize),
  })

  const handlePageSizeChange = (newPageSize: number) => {
    setPagination(prev => ({
      pageIndex: 0, // Reset to first page when changing page size
      pageSize: newPageSize,
    }))
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={() => {
            if (
              table.getFilteredSelectedRowModel().rows.length > 0 &&
              handleDeleteSelected
            ) {
              handleDeleteSelected(
                table
                  .getFilteredSelectedRowModel()
                  .rows.map(row => row.original as Loader)
              )
            }
          }}
        >
          <TrashIcon
            className={`h-6 w-6 ${
              table.getFilteredSelectedRowModel().rows.length > 0
                ? 'text-red-600'
                : 'text-gray-30'
            }`}
          />
        </Button>
        <FancyInput
          placeholder={filterInputPlaceholder}
          value={
            (table.getColumn(table.getAllColumns()[0]?.id)?.getFilterValue() as
              | string
              | undefined) ?? ''
          }
          onChange={event =>
            table
              .getColumn(table.getAllColumns()[0]?.id)
              ?.setFilterValue(event.target.value)
          }
          className="max-w-sm h-8"
          {...filterInputProps}
        />
        <div className="ml-auto flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="portal-neutral" size="sm" className="ml-auto">
                Show {pageSize} <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {[10, 20, 30, 40, 50].map(size => (
                <DropdownMenuItem
                  key={size}
                  onSelect={() => handlePageSizeChange(size)}
                >
                  Show {size}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="portal-neutral"
                size="sm"
                className="ml-auto"
                {...columnVisibilityButtonProps}
              >
                Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter(column => column.getCanHide())
                .map(column => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={value =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table {...tableProps}>
          <TableHeader {...tableHeaderProps}>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead
                      className="text-sm"
                      key={header.id}
                      {...tableHeadProps}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody {...tableBodyProps}>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  {...tableRowProps}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} {...tableCellProps}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  {renderRowActionMenu && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <DotsHorizontalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          {renderRowActionMenu(row)}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                  {onDelete && (
                    <TableCell>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => onDelete([row.original])}
                      >
                        <TrashIcon className="h-4 w-4 text-red-600" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1} // +1 for the delete button column
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div
        className="flex items-center justify-end space-x-2 py-4"
        {...paginationDivProps}
      >
        <div
          className="flex-1 text-sm text-muted-foreground"
          {...pageCountDivProps}
        >
          {table.getFilteredSelectedRowModel().rows.length > 0
            ? `${table.getFilteredSelectedRowModel().rows.length} of ${
                table.getFilteredRowModel().rows.length
              } row(s) selected.`
            : `Page ${
                table.getState().pagination.pageIndex + 1
              } of ${table.getPageCount()}`}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            {...previousButtonProps}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            {...nextButtonProps}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
