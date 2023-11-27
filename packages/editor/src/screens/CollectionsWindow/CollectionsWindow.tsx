import {
  DataTable,
  DataTableRowActions,
  RecordTableSchema,
  generateColumns,
  DataTableProps,
} from '@magickml/client-core'
import { useState, useEffect } from 'react'
import { useConfig } from '@magickml/client-core'
import {
  useDeleteCollectionMutation,
  useGetCollectionsQuery,
  useCreateCollectionMutation,
  useGetRecordsQuery,
  useCreateRecordMutation,
  useDeleteRecordMutation,
} from '@magickml/core'

import { Label, Input } from '@magickml/ui'

import CollectionSwitcher from './CollectionSwitcher'

type Collection = {
  id: string
  name: string
}

/**
 * CollectionsWindow component. Displays an overlay with options to manage collections.
 * @returns JSX.Element - CollectionsWindow component
 */
const CollectionsWindow = (): JSX.Element => {
  const config = useConfig()

  const [selectedCollection, setSelectedCollection] = useState<Collection>({
    id: 'all',
    name: 'All',
  })

  const handleChangeCollection = (collectionId: string): void => {
    const newCollection = collections?.data?.find(
      collection => collection.id === collectionId
    )

    setSelectedCollection(newCollection)
  }

  const [newCollectionName, setNewCollectionName] = useState<string>('')
  const handleNewCollectionNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setNewCollectionName(e.target.value)
  }

  // collection hooks
  const {
    data: collections,
    error,
    refetch: refetchCollection,
  } = useGetCollectionsQuery({
    projectId: config.projectId,
  })
  const [createCollection] = useCreateCollectionMutation()

  const handleCreateCollection = async (): Promise<void> => {
    try {
      await createCollection({
        projectId: config.projectId,
        name: newCollectionName,
      })
      setNewCollectionName('')
      refetchCollection()
    } catch (err) {
      console.error('Error creating collection', err)
    }
  }
  const [deleteCollection] = useDeleteCollectionMutation()

  // Record hooks
  const { data: records, refetch } = useGetRecordsQuery({
    collectionId:
      selectedCollection.id == 'all' ? undefined : selectedCollection.id,
    projectId: config.projectId,
  })

  const [createRecord] = useCreateRecordMutation()

  const [deleteRecord] = useDeleteRecordMutation()

  const onDelete = async (collectionId: string): Promise<void> => {
    try {
      await deleteCollection({ collectionId, projectId: config.projectId })
    } catch (err) {
      console.error('Error deleting collection', err)
    }
  }

  const onDeleteRecord = async (recordId: string): Promise<void> => {
    try {
      await deleteRecord({ recordId, projectId: config.projectId })
      // Handle the rest of the logic for deleting a record, e.g., UI updates, etc.
    } catch (err) {
      console.error('Error deleting record', err)
    }
  }

  useEffect(() => {
    if (selectedCollection) {
      refetch()
    }
  }, [selectedCollection])

  type StorageCardData = {
    id: string
    model: string
    type: 'image' | 'audio' | 'video'
    createdAt: string
    urls: string[]
  }

  const sampleData: StorageCardData[] = [
    {
      id: '1',
      model: 'Stable Diffusion XL',
      type: 'image',
      createdAt: '2023-01-01',
      urls: [
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl1QfyfNeluP95T3QLwhXoQnKYMYm-zQ6AqGSMpHWdrQ&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl1QfyfNeluP95T3QLwhXoQnKYMYm-zQ6AqGSMpHWdrQ&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl1QfyfNeluP95T3QLwhXoQnKYMYm-zQ6AqGSMpHWdrQ&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl1QfyfNeluP95T3QLwhXoQnKYMYm-zQ6AqGSMpHWdrQ&s',
      ],
    },
    {
      id: '2',
      model: 'Musicgen',
      type: 'audio',
      createdAt: '2023-02-01',
      urls: [
        'https://www2.cs.uic.edu/~i101/SoundFiles/StarWars3.wav',
        'https://www2.cs.uic.edu/~i101/SoundFiles/StarWars3.wav',
        'https://www2.cs.uic.edu/~i101/SoundFiles/StarWars3.wav',
      ],
    },
    {
      id: '3',
      model: 'Zeroshot',
      type: 'video',
      createdAt: '2023-03-01',
      urls: [
        'https://file-examples.com/wp-content/storage/2018/04/file_example_AVI_480_750kB.avi',
      ],
    },
  ]

  // table setup
  const recordColumns = generateColumns<RecordTableSchema>({
    columnsConfig: [
      {
        accessorKey: 'id',
        title: 'id',
        options: {
          enableSorting: false,
          enableHiding: false,
        },
      },
      {
        accessorKey: 'key',
        title: 'Key',
      },
      {
        accessorKey: 'data',
        title: 'Data',
        options: {
          cellFormatter: (value, row) => <span>{JSON.stringify(value)}</span>,
        },
      },
      {
        accessorKey: 'createdAt',
        title: 'Created At',
        options: {
          cellFormatter: (value, row) => (
            <span>{new Date(value).toLocaleString()}</span>
          ),
        },
      },
    ],
    additionalActions: [
      {
        id: 'actions',
        cell: ({ row }) => (
          <DataTableRowActions
            row={row}
            actions={[
              { label: 'Open', onClick: row => console.log('Opening', row) },
              {
                label: 'Edit',
                onClick: row => console.log('Editing', row),
                disabled: true,
              },
              {
                label: 'Delete',
                onClick: row => onDeleteRecord(row.getValue('id')),
                isDangerous: true,
              },
            ]}
          />
        ),
      },
    ],
  })

  return (
    <div className="h-screen flex-col overflow-hidden w-full p-8">
      {/* <div className="h-8" />
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Generations
          </h2>
          <p className="text-white/80">
            Here you can view and manage all of the media your agents have
            generated.
          </p>
        </div>
      </div>
      <div className="h-16" /> */}
      {/* <div className="grid  2xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-y-10">
        {sampleData.map((data, index) => (
          <StorageCard key={index} {...data} />
        ))}
        {sampleData.map((data, index) => (
          <StorageCard key={index} {...data} />
        ))}
      </div> */}

      <div className="h-full overflow-y-auto flex w-full items-center justify-center">
        <div className="mx-auto w-full flex flex-col h-full">
          <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
            <div className="flex items-center justify-between space-y-2">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  Collections & Records
                </h2>
                <p className="text-white/80 pb-8">
                  Here you can view and manage all of the collections and
                  records your agents have stored.
                  <br /> You can also create new collections and records.
                </p>
                <div className="flex flex-col gap-y-1 text-white">
                  <Label htmlFor="collection">Collection</Label>
                  <CollectionSwitcher
                    id="collection"
                    collections={collections?.data}
                    activeCollection={selectedCollection}
                    onCollectionChange={handleChangeCollection}
                    dialogContent={
                      <div className="text-white">
                        <Label htmlFor="collectionName">Collection name</Label>
                        <Input
                          value={newCollectionName}
                          onChange={handleNewCollectionNameChange}
                          id="collectionName"
                          placeholder="My collection"
                        />
                      </div>
                    }
                    dialogTitle="Create a new collection"
                    dialogDescription="Add a new collection for your agents to access."
                    onDialogSubmit={handleCreateCollection}
                  />
                </div>
              </div>
            </div>
            {records?.data ? (
              <DataTable
                data={records?.data}
                columns={recordColumns}
                emptyMessage={
                  selectedCollection.id === 'all'
                    ? 'No records'
                    : `No records found in ${selectedCollection.name}`
                }
                searchColumn="key"
                searchPlaceholder="Search records by key..."
                pageSizes={[10, 25, 50]}
                labels={{
                  rowsPerPage: 'Records per page',
                  of: 'out of',
                  page: 'Page',
                  selected: 'selected',
                  row: 'record',
                  rows: 'records',
                }}
                onPageChange={pageIndex =>
                  console.log(`New page: ${pageIndex}`)
                }
                onPageSizeChange={pageSize =>
                  console.log(`New page size: ${pageSize}`)
                }
              />
            ) : (
              <p>loading</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollectionsWindow

export { CollectionSwitcher }
