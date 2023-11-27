import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'

import { Button, Input } from '@magickml/ui'
import { DataTableViewOptions } from './DataTableViewOptions'

export interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filterColumn?: string
  filterPlaceholder?: string
  renderResetButton?: () => React.ReactNode
  renderExtraControls?: () => React.ReactNode
}

export function DataTableToolbar<TData>({
  table,
  filterColumn = 'key',
  filterPlaceholder = 'Filter records...',
  renderResetButton,
  renderExtraControls,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const defaultResetButton = (
    <Button
      variant="ghost"
      onClick={() => table.resetColumnFilters()}
      className="h-8 px-2 lg:px-3 text-white"
    >
      Reset
      <Cross2Icon className="ml-2 h-4 w-4" />
    </Button>
  )

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={filterPlaceholder}
          value={
            (table.getColumn(filterColumn)?.getFilterValue() as string) ?? ''
          }
          onChange={event =>
            table.getColumn(filterColumn)?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px] text-white placeholder:text-white/60 border-white/80 focus:border-white"
        />

        {isFiltered &&
          (renderResetButton ? renderResetButton() : defaultResetButton)}
      </div>
      <div className="flex items-center">
        {renderExtraControls && renderExtraControls()}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
