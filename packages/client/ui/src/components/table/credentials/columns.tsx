import { ColumnDef } from '@tanstack/react-table'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Button } from '../../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu'

export type Credential = {
  id: string
  projectId: string
  name: string
  serviceType: string
  credentialType: string
  description: null | string
  created_at: string
  updated_at: string
}
import { useConfig } from '@magickml/providers'

import { useDeleteCredentialMutation } from 'client/state'

export const columns: ColumnDef<Credential>[] = [
  // {
  //   accessorKey: 'id',
  //   header: 'ID',
  // },
  // {
  //   accessorKey: 'projectId',
  //   header: 'Project ID',
  // },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'serviceType',
    header: 'Service Type',
  },
  // {
  //   accessorKey: 'credentialType',
  //   header: 'Credential Type',
  // },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
  },
  // {
  //   accessorKey: 'updated_at',
  //   header: 'Updated At',
  // },
  {
    id: 'actions',
    cell: ({ row }) => {
      const credential = row.original
      const { projectId } = useConfig()
      const [deleteCredential] = useDeleteCredentialMutation()

      const handleDelete = async () => {
        await deleteCredential({ credentialId: credential.id, projectId })
      }
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(credential.name)}
            >
              Copy Name
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
