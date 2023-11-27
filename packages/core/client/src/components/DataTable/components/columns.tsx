import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@magickml/ui'
import { DataTableColumnHeader } from './DataTableColumnHeader'

export type ColumnOptions<T> = {
  enableSorting?: boolean
  enableHiding?: boolean
  cellFormatter?: (value: any, row: any) => JSX.Element
  headerFormatter?: (column: any) => JSX.Element
}

export type GenerateColumnsParams<T> = {
  columnsConfig: {
    accessorKey: keyof T
    title: string
    options?: ColumnOptions<T>
  }[]
  additionalActions?: {
    id: string
    cell: ({ row }: { row: any }) => JSX.Element
  }[]
}

export function generateColumns<T>({
  columnsConfig,
  additionalActions,
}: GenerateColumnsParams<T>): ColumnDef<T>[] {
  const generatedColumns = columnsConfig.map(
    ({ accessorKey, title, options = {} }) => ({
      accessorKey,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={title} />
      ),
      cell: ({ row }) => {
        const value = row.getValue(accessorKey as string)
        return options.cellFormatter ? (
          options.cellFormatter(value, row)
        ) : (
          <div>{String(value)}</div>
        )
      },
      enableSorting: options.enableSorting,
      enableHiding: options.enableHiding,
    })
  )

  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px] text-white"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px] text-white"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    ...generatedColumns,
    ...(additionalActions || []),
  ]
}