'use client'

import React, { useEffect, useState } from 'react'
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
} from '@magickml/embedder-schemas'
import { TextareaWithLabel, InputWithLabel, Button } from '@magickml/client-ui'
import { createEmbedderReactClient } from '@magickml/embedder-client-react'
import { useAtomValue } from 'jotai'
import { activePackIdAtom } from '../_pkg/state'
import toast from 'react-hot-toast'
import FileDropper from './fileDropper'
import { ZodTypeAny } from 'zod'
import {
  UploadImageProps,
  uploadImage,
} from '../dialogs/add/knowledge-upload-content'
import { AddKnowledge } from 'servicesShared'
import {
  ClientProjectPresignType,
  useGetPresignedUrlMutation,
} from 'client/state'

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
  const [newKnowledge, setNewKnowledge] = useState<AddKnowledge[]>([])

  const [getPresignedUrl, getPresignedUrlState] = useGetPresignedUrlMutation()
  const [userEditedFilePathOrUrl, setUserEditedFilePathOrUrl] = useState('')
  const isLoading = getPresignedUrlState.isLoading

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files

    if (files) {
      const filePromises = Array.from(files).map(async file => {
        const fileType = file.name.split('.').pop()

        const newFile = {
          tag: 'tag',
          name: file.name,
          sourceUrl: '',
          dataType: file.type,
          status: 'uploading',
        }
        setNewKnowledge([...newKnowledge, newFile])

        const response = await getPresignedUrl({
          //
          id: file.name,
          projectId: config?.projectId || '',
          fileName: file.name,
          type: fileType as ClientProjectPresignType,
        })

        if ('data' in response && response.data) {
          const upload: UploadImageProps = {
            presignedUrl: {
              url: response.data.url,
              key: response.data.key,
            },
            imageFile: file,
          }

          const key = await uploadImage(upload)

          // Update the file status to 'uploaded' after successful upload
          setNewKnowledge(prevKnowledge =>
            prevKnowledge.map(knowledge =>
              knowledge.name === file.name
                ? { ...knowledge, status: 'uploaded', sourceUrl: key }
                : knowledge
            )
          )

          return {
            tag: 'tag',
            name: file.name,
            sourceUrl: key,
            dataType: file.type,
            status: 'uploaded',
          }
        } else if ('error' in response) {
          toast.error('Error generating URL for upload')

          // Update the file status to 'error' if URL generation fails
          setNewKnowledge(prevKnowledge =>
            prevKnowledge.map(knowledge =>
              knowledge.name === file.name
                ? { ...knowledge, status: 'error' }
                : knowledge
            )
          )

          return {
            tag: 'tag',
            name: file.name,
            sourceUrl: '',
            dataType: file.type,
            status: 'error',
          }
        } else {
          toast.error('Error uploading file. Please try again.')

          // Update the file status to 'error' if upload fails
          setNewKnowledge(prevKnowledge =>
            prevKnowledge.map(knowledge =>
              knowledge.name === file.name
                ? { ...knowledge, status: 'error' }
                : knowledge
            )
          )

          return {
            tag: 'tag',
            name: file.name,
            sourceUrl: '',
            dataType: file.type,
            status: 'error',
          }
        }
      })

      await Promise.all(filePromises)
    }
  }

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
    if (!config.filePathOrUrl) {
      toast.error('File path or URL is required loaders')
      return
    }

    await createLoader({
      type: selectedType,
      name,
      description,
      config: {
        ...config,
        type: selectedType,
      } as any,
      isUpload: true,
      path: config.filePathOrUrl,
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

  useEffect(() => {
    const { sourceUrl, name } = getLatestUploadedFile()
    if (sourceUrl) {
      setConfig(prevConfig => ({
        ...prevConfig,
        source: sourceUrl,
        filePathOrUrl: sourceUrl,
      }))
      setUserEditedFilePathOrUrl(sourceUrl)
    }
    if (name) {
      setName(name)
    }
  }, [newKnowledge])

  function splitCamelCase(str: string) {
    return (
      str
        // Insert a space before any uppercase letter that follows a lowercase letter or number
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        // Insert a space before any uppercase letter that follows another uppercase letter but is followed by a lowercase letter
        .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
        // Capitalize the first letter of each word
        .replace(/\b\w/g, c => c.toUpperCase())
    )
  }

  const getLatestUploadedFile = () => {
    const uploadedKnowledge = newKnowledge.find(k => k.status === 'uploaded')
    return uploadedKnowledge
      ? { sourceUrl: uploadedKnowledge.sourceUrl, name: uploadedKnowledge.name }
      : { sourceUrl: '', name: '' }
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
              accept={{ [fileTypesMapping[selectedType]]: [] }}
              className="max-w-2xl w-full"
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
              const splitKey = splitCamelCase(key)

              return (
                <InputWithLabel
                  key={splitKey}
                  id={key}
                  label={splitKey}
                  name={splitKey}
                  className="w-full"
                  onChange={e => {
                    const value = e.target.value
                    const safeValue = key === 'filePathOrUrl' ? value : value
                    setConfig(prevConfig => ({
                      ...prevConfig,
                      [key]: safeValue,
                    }))

                    // If the key is 'filePathOrUrl', update the userEditedFilePathOrUrl state
                    if (key === 'filePathOrUrl') {
                      setUserEditedFilePathOrUrl(safeValue)
                    }
                  }}
                  value={
                    key === 'filePathOrUrl'
                      ? userEditedFilePathOrUrl
                      : config[key]
                  }
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
                disabled={isLoading}
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
