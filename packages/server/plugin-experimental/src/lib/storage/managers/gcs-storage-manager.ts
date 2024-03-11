import { Storage } from '@google-cloud/storage'
import { PluginStorageManager } from '../plugin-storage-manager'

export class GCPPluginStorageManager extends PluginStorageManager {
  private storage: Storage
  private bucket: string

  constructor(
    agentId: string,
    plugin: string,
    keyFilename: string,
    bucketName: string
  ) {
    super(agentId, plugin)
    this.storage = new Storage({ keyFilename })
    this.bucket = bucketName
  }

  async uploadFile(
    file: Buffer,
    fileName: string,
    contentType: string
  ): Promise<string> {
    const bucket = this.storage.bucket(this.bucket)
    const blob = bucket.file(`${this.agentId}/${this.plugin}/${fileName}`)

    await blob.save(file, { contentType })
    return this.getFileUrl(fileName)
  }

  async getFileUrl(fileName: string): Promise<string> {
    const bucket = this.storage.bucket(this.bucket)
    const blob = bucket.file(`${this.agentId}/${this.plugin}/${fileName}`)

    const [url] = await blob.getSignedUrl({
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    })

    return url
  }

  async deleteFile(fileName: string): Promise<void> {
    const bucket = this.storage.bucket(this.bucket)
    const blob = bucket.file(`${this.agentId}/${this.plugin}/${fileName}`)

    await blob.delete()
  }
}
