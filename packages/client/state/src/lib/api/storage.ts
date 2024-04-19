import { rootApi } from './api'

export enum ClientProjectPresignType {
  knowledge = 'knowledge',
  eml = 'eml',
  html = 'html',
  json = 'json',
  md = 'md',
  msg = 'msg',
  rst = 'rst',
  rtf = 'rtf',
  txt = 'txt',
  xml = 'xml',
  jpeg = 'jpeg',
  jpg = 'jpg',
  png = 'png',
  csv = 'csv',
  doc = 'doc',
  docx = 'docx',
  epub = 'epub',
  odt = 'odt',
  pdf = 'pdf',
  ppt = 'ppt',
  pptx = 'pptx',
  tsv = 'tsv',
  xlsx = 'xlsx',
}

export interface PresignedUrlRequest {
  id: string
  projectId: string
  fileName: string
  type: ClientProjectPresignType
}

export interface PresignedUrlResponse {
  url: string
  key: string
}

export const storageApi = rootApi.injectEndpoints({
  endpoints: builder => ({
    getPresignedUrl: builder.mutation<
      PresignedUrlResponse,
      PresignedUrlRequest
    >({
      query: data => ({
        url: '/presigner',
        method: 'POST',
        body: data,
      }),
    }),
  }),
})

export const { useGetPresignedUrlMutation } = storageApi
