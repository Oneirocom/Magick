import { useConfig, useTabLayout } from '@magickml/providers'
import { Button, CredentialsTable, columns } from '@magickml/client-ui'
import { useListCredentialsQuery } from 'client/state'
import { Header } from './Header'
import { CreateCredential } from './CreateCredentials'
import { useState } from 'react'
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'

export const SecretWindow = (): JSX.Element => {
  const config = useConfig()
  const { openTab } = useTabLayout()

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const openConfigWindow = () => {
    openTab({
      id: 'Config',
      name: 'Config',
      type: 'Config',
      switchActive: true,
    })
  }

  const { data: credentials, isLoading } = useListCredentialsQuery({
    projectId: config.projectId,
  })

  if (isLoading || !credentials) {
    return <div>Loading...</div>
  }

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden">
      <div className="inline-flex w-full justify-between items-center space-x-2 p-8">
        <Header sortType={'All'} />
        <CreateCredential
          projectId={config.projectId}
          currentCreds={credentials}
        />
        <Button variant="portal-neutral" onClick={openConfigWindow}>
          Link
        </Button>
      </div>
      <div className="grid gap-6 p-8">
        <CredentialsTable
          columns={columns}
          data={credentials}
          sorting={sorting}
          columnFilters={columnFilters}
          columnVisibility={columnVisibility}
          rowSelection={rowSelection}
          setSorting={setSorting}
          setColumnFilters={setColumnFilters}
          setColumnVisibility={setColumnVisibility}
          setRowSelection={setRowSelection}
        />
      </div>
    </div>
  )
}
