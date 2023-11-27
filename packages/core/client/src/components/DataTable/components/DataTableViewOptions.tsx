import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { MixerHorizontalIcon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'

import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@magickml/ui'

export interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
  filterColumns?: (column: any) => boolean
  renderItem?: (
    column: any,
    toggleVisibility: (value: boolean) => void
  ) => React.ReactNode
}

export function DataTableViewOptions<TData>({
  table,
  filterColumns,
  renderItem,
}: DataTableViewOptionsProps<TData>) {
  const defaultFilter = (column: any) =>
    typeof column.accessorFn !== 'undefined' && column.getCanHide()

  const columnsToDisplay = table
    .getAllColumns()
    .filter(filterColumns || defaultFilter)

  const defaultRenderItem = (
    column: any,
    toggleVisibility: (value: boolean) => void
  ) => (
    <DropdownMenuCheckboxItem
      key={column.id}
      className="capitalize"
      checked={column.getIsVisible()}
      onCheckedChange={toggleVisibility}
    >
      {column.id}
    </DropdownMenuCheckboxItem>
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className='text-white'>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <MixerHorizontalIcon className="mr-2 h-4 w-4" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px] text-white bg-black">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columnsToDisplay.map(column => {
          const toggleVisibility = (value: boolean) =>
            column.toggleVisibility(!!value)
          return renderItem
            ? renderItem(column, toggleVisibility)
            : defaultRenderItem(column, toggleVisibility)
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
