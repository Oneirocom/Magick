export enum KnowledgeUploadStatus {
  IDLE,
  UPLOADING,
  UPLOADED,
}

export enum KnowledgeDialogTab {
  URL = 'url',
  UPLOAD = 'upload',
}

export interface NewKnowledgeState {
  tag: string
  name: string
  sourceUrl: string
  dataType: string
}

export type KnowledgeUploadedFile = {
  id: string
  type: string
  status: KnowledgeUploadStatus
}
