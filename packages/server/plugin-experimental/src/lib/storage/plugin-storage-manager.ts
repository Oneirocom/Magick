export abstract class PluginStorageManager {
  protected plugin: string
  protected agentId: string

  constructor(agentId: string, plugin: string) {
    this.plugin = plugin
    this.agentId = agentId
  }

  abstract uploadFile(
    file: Buffer,
    fileName: string,
    contentType: string
  ): Promise<string>
  abstract getFileUrl(fileName: string): Promise<string>
  abstract deleteFile(fileName: string): Promise<void>
}
