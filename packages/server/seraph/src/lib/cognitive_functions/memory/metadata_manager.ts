// metadata_manager.ts
import fs from 'fs/promises'
import path from 'path'

// import { fileURLToPath } from 'url'

//@ts-ignore
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)
class MetadataManager {
  private metadataFilePath: string

  constructor() {
    this.metadataFilePath = path.join(
      __dirname,
      '..',
      'metadata_descriptions.json'
    )
  }

  async addMetadataDescription(
    key: string,
    description: string
  ): Promise<void> {
    if (typeof key !== 'string' || typeof description !== 'string') {
      throw new Error('Invalid metadata key or description')
    }

    const metadataDescriptions = await this.loadMetadataDescriptions()
    metadataDescriptions[key] = description
    await this.saveMetadataDescriptions(metadataDescriptions)
  }

  async getMetadataDescriptions(): Promise<Record<string, string>> {
    return this.loadMetadataDescriptions()
  }

  async getPromptInjection(): Promise<string> {
    const metadataDescriptions = await this.getMetadataDescriptions()
    const metadataDescriptionsString = Object.entries(metadataDescriptions)
      .map(([key, value]) => `- ${key}: ${value}`)
      .join('\n')

    return `
      Available memory types:
      - code: Stores generated code and related information
      - context: Stores contextual information
      - reflection: Stores self-reflection and performance metrics
      - facts: Stores facts and general knowledge

      Available metadata tags:
      ${metadataDescriptionsString}
    `
  }

  private async loadMetadataDescriptions(): Promise<Record<string, string>> {
    try {
      const data = await fs.readFile(this.metadataFilePath, 'utf-8')
      return JSON.parse(data)
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, return an empty object
        return {}
      }
      throw error
    }
  }

  private async saveMetadataDescriptions(
    metadataDescriptions: Record<string, string>
  ): Promise<void> {
    try {
      await fs.writeFile(
        this.metadataFilePath,
        JSON.stringify(metadataDescriptions, null, 2),
        'utf-8'
      )
    } catch (error) {
      console.error('Error saving metadata descriptions:', error)
      throw error
    }
  }
}

const metadataManager = new MetadataManager()

export { metadataManager }
