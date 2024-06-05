import React from 'react'
import { PortalDialog, ScrollArea } from '@magickml/client-ui'
import { createEmbedderReactClient } from '@magickml/embedder-client-react'

type ChunksDialogProps = {
  state: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  client: ReturnType<typeof createEmbedderReactClient>
  loaderId: string | null
  packId: string | null
}

export const ChunksDialog: React.FC<ChunksDialogProps> = ({
  state,
  client,
  loaderId,
  packId,
}) => {
  const [open, setOpen] = state
  const { data, isLoading } = client.useGetLoaderChunks(
    {
      params: {
        id: packId || '',
        loaderId: loaderId || '',
      },
    },
    {
      enabled: !!packId && !!loaderId,
    }
  )

  // 🧟
  const frankenstein = (data: any) => {
    return data.map((chunk: any) => chunk).join()
  }

  return (
    <PortalDialog
      base={{
        root: {
          open: open,
          onOpenChange: setOpen,
        },
      }}
      title="Chunks"
      description=""
      footerText="Create"
      footerButton={{
        onClick: () => setOpen(false),
        variant: 'portal-primary',
        className: 'w-full',
      }}
      triggerButton={{
        className: 'hidden',
      }}
    >
      <div className="flex flex-col gap-8">
        <ScrollArea className="max-h-96 w-full rounded-md border">
          <div className="p-4">
            <p className="prose">
              {isLoading ? (
                <span className="loading loading-spinner" />
              ) : (
                frankenstein(data?.chunks || [])
              )}
            </p>
          </div>
        </ScrollArea>
      </div>
    </PortalDialog>
  )
}
