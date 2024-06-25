'use client'

import React, { useState } from 'react'
import {
  FileIcon,
  FileSpreadsheetIcon,
  MapIcon,
  TextIcon,
  WebcamIcon,
  YoutubeIcon,
  PresentationIcon,
} from 'lucide-react'
import {
  type LoaderType,
  TextLoaderSchema,
  YoutubeLoaderSchema,
  YoutubeChannelLoaderSchema,
  YoutubeSearchLoaderSchema,
  WebLoaderSchema,
  SitemapLoaderSchema,
  PdfLoaderSchema,
  DocxLoaderSchema,
  ExcelLoaderSchema,
  PptLoaderSchema,
  LoaderTypeSchema,
} from '@magickml/embedder/schema'
import { TextareaWithLabel, InputWithLabel, Button } from '@magickml/client-ui'
import { createEmbedderReactClient } from '@magickml/embedder-client-react'
import { useAtomValue } from 'jotai'
import { activePackIdAtom } from '../_pkg/state'
import toast from 'react-hot-toast'
import FileDropper from './fileDropper'
import useFileUpload from '../../../../../../client/editor/src/hooks/useFileUpload'
import { ZodTypeAny } from 'zod'

const loaderTypeProperties: Record<
  LoaderType,
  { icon: React.ElementType; description: string; showFileDropper?: boolean }
> = {
  text: {
    icon: TextIcon,
    description: 'Load and process text data with ease.',
    showFileDropper: true,
  },
  youtube: {
    icon: YoutubeIcon,
    description: 'Load and process YouTube video data.',
  },
  youtube_channel: {
    icon: YoutubeIcon,
    description: 'Load and process data from entire YouTube channels.',
  },
  youtube_search: {
    icon: YoutubeIcon,
    description: 'Load and process data from YouTube search results.',
  },
  web: {
    icon: WebcamIcon,
    description: 'Load and process data from websites.',
  },
  sitemap: { icon: MapIcon, description: 'Load and process website sitemaps.' },
  pdf: {
    icon: FileIcon,
    description: 'Load and process PDF documents.',
    showFileDropper: true,
  },
  docx: {
    icon: FileIcon,
    description: 'Load and process Word documents.',
    showFileDropper: true,
  },
  excel: {
    icon: FileSpreadsheetIcon,
    description: 'Load and process Excel spreadsheets.',
    showFileDropper: true,
  },
  ppt: {
    icon: PresentationIcon,
    description: 'Load and process PowerPoint presentations.',
    showFileDropper: true,
  },
}

const loaderSchemas: Record<LoaderType, ZodTypeAny> = {
  text: TextLoaderSchema,
  youtube: YoutubeLoaderSchema,
  youtube_channel: YoutubeChannelLoaderSchema,
  youtube_search: YoutubeSearchLoaderSchema,
  web: WebLoaderSchema,
  sitemap: SitemapLoaderSchema,
  pdf: PdfLoaderSchema,
  docx: DocxLoaderSchema,
  excel: ExcelLoaderSchema,
  ppt: PptLoaderSchema,
}

type Props = {
  client: ReturnType<typeof createEmbedderReactClient>
}

export const LoaderPicker: React.FC<Props> = ({ client }) => {
  const [selectedType, setSelectedType] = useState<LoaderType | null>(null)
  const activePackId = useAtomValue(activePackIdAtom)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [config, setConfig] = useState<Record<string, any>>({})
  const {
    loading,
    newKnowledge,
    setKnowledge,
    handleDataTypesChange,
    handleFileUpload,
    triggerFileUpload,
  } = useFileUpload({
    initialState: {
      name: '',
      sourceUrl: '',
      dataType: '',
      files: [] as File[],
      tag: '',
    },
  })

  const { invalidate } = client.useFindPack(
    {
      params: {
        id: activePackId || '',
      },
    },
    {
      enabled: !!activePackId,
    }
  )

  const { mutateAsync: createLoader } = client.useAddLoader(
    {
      params: {
        id: activePackId || '',
      },
    },
    {
      onSuccess: async () => {
        await invalidate()
        toast.success('Loader added successfully.')
        setName('')
        setDescription('')
        setConfig({})
        setSelectedType(null)
      },
      onError: () => {
        toast.error('Failed to add loader.')
      },
    }
  )

  const handleCreateLoader = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedType) return
    await createLoader({
      type: selectedType,
      name,
      description,
      config: {
        ...config,
        type: selectedType,
      } as any,
    })
  }

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault()
    setName('')
    setDescription('')
    setConfig({})
    setSelectedType(null)
  }

  const fileTypesMapping: Record<LoaderType, string> = {
    text: '.txt',
    youtube: '',
    youtube_channel: '',
    youtube_search: '',
    web: '',
    sitemap: '.xml',
    pdf: '.pdf',
    docx: '.docx',
    excel: '.xlsx',
    ppt: '.pptx',
  }

  return (
    <div className="w-full flex gap-4 flex-wrap mx-auto items-center">
      {!selectedType ? (
        LoaderTypeSchema.options.map(type => {
          const { icon: Icon, description } = loaderTypeProperties[type]
          return (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className="border pointer-events-auto hover:border-ds-primary w-56 h-56 border-border bg-ds-card-alt hover:border rounded-lg p-4 flex flex-col items-center justify-center gap-3 group transition-colors"
            >
              <div className="bg-ds-card rounded-full p-3">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium capitalize">
                {type.replace(/_/g, ' ')}
              </h3>
              <p className="text-sm text-center">{description}</p>
            </button>
          )
        })
      ) : (
        <div className="flex flex-col gap-4 w-full">
          <h2 className="text-xl font-semibold">
            {selectedType.replace(/_/g, ' ')}
          </h2>
          {loaderTypeProperties[selectedType].showFileDropper && (
            <FileDropper
              handleFileUpload={handleFileUpload}
              type={selectedType}
              accept={{
                [fileTypesMapping[selectedType]]: [],
              }}
              className="max-w-2xl w-full"
              fileTypes={[fileTypesMapping[selectedType]]}
            />
          )}
          <p>{loaderTypeProperties[selectedType].description}</p>
          <form
            className="flex flex-col gap-4 max-w-2xl w-full"
            onSubmit={handleCreateLoader}
          >
            <InputWithLabel
              id="name"
              label="Name"
              placeholder="Name of the loader."
              onChange={e => setName(e.target.value)}
              value={name}
              className="w-full"
            />
            <TextareaWithLabel
              id="description"
              label="Description"
              placeholder="Description for the loader."
              onChange={e => setDescription(e.target.value)}
              value={description}
              className="w-full"
            />
            {Object.keys(loaderSchemas[selectedType]._def.shape()).map(key => {
              if (key === 'type') return null
              return (
                <InputWithLabel
                  key={key}
                  id={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  name={key.charAt(0).toUpperCase() + key.slice(1)}
                  className="w-full"
                  onChange={e =>
                    setConfig({
                      ...config,
                      [key]: e.target.value,
                    })
                  }
                  value={config[key]}
                />
              )
            })}
            <div className="inline-flex gap-x-4">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                className="w-full"
              >
                Cancel
              </Button>

              <Button
                size="sm"
                variant="portal-primary"
                className="w-full"
                type="submit"
              >
                Add Loader
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
