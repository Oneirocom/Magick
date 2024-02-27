export interface CreateClientOptions {
  credentials: {
    accessKeyId: string
    secretAccessKey: string
  }
  region: string
  endpoint: string
  forcePathStyle: boolean
}

export const uploadTypes = [
  'userAvatar',
  'userBanner',
  'projectAvatar',
  'agentAvatar',
] as const

export type UploadType = (typeof uploadTypes)[number]

export const typeToFolderAndFileKeyMap: {
  [K in UploadType]: { folder: string; fileKey: string }
} = {
  userAvatar: { folder: 'users', fileKey: 'avatar.jpg' },
  userBanner: { folder: 'users', fileKey: 'banner.jpg' },
  projectAvatar: { folder: 'projects', fileKey: 'avatar.jpg' },
  agentAvatar: { folder: 'agents', fileKey: 'avatar.jpg' },
}
