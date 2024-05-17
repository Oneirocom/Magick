export const defaultImagePath = '/images/default/'
export const defaultBannerImagePath = '/images/banners/default/'
export const bucketImagePath = process.env['NEXT_PUBLIC_BUCKET_PREFIX']
export const hashStringToInt = (s: string, max: number) => {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  }
  return Math.abs((h % max) + 1)
}

export const defaultImage = (projectId: string) => {
  return `${defaultImagePath}image-${hashStringToInt(projectId, 117)}.jpeg`
}

export const defaultBannerImage = (userId: string) => {
  return `${defaultBannerImagePath}banner-${hashStringToInt(userId, 10)}.png`
}

export enum ImageType {
  IMAGE = 'image',
  BANNER = 'banner',
}

type GetImageParams = {
  id: string
  image: string | null | undefined
  type: ImageType
}

export const getImage = (params: GetImageParams) => {
  if (params.image) {
    if (
      // this is a hack ill do better later
      params.image.startsWith('/') ||
      params.image.startsWith('templates') ||
      params.image.startsWith('projects') ||
      params.image.startsWith('users') ||
      params.image.startsWith('agents')
    ) {
      return `${bucketImagePath}${params.image}`
    } else {
      return params.image
    }
  } else {
    switch (params.type) {
      case ImageType.IMAGE:
        return defaultImage(params.id)
      case ImageType.BANNER:
        return defaultBannerImage(params.id)
    }
  }
}
