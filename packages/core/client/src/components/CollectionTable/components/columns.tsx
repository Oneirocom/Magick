import { ColumnDef } from '@tanstack/react-table'

import { Badge, Checkbox } from '@magickml/ui'

import { Task } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<Task>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'key',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Key" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue('key')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'data',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="data" />
    ),
    cell: ({ row }) => {
      // const label = labels.find(label => label.value === row.original.label)
      const label = 'test'

      return (
        <div className="flex space-x-2">
          {/* {label && <Badge variant="outline">{label}</Badge>} */}
          <span className="max-w-[500px] truncate font-medium">
            {JSON.stringify(row.getValue('data'))}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="createdAt" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[140px] items-center">
          <span>{new Date(row.getValue('createdAt')).toLocaleString()}</span>
        </div>
      )
    },
    // filterFn: (rows, filterValue) => {
    //   return rows.(row => {
    //     const date = new Date(row.original.createdAt)
    //     const dateString = date.toLocaleDateString()
    //     return dateString.includes(filterValue)
    //   })
    // },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
