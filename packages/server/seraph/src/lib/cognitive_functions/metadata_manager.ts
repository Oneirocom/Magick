// metadata_manager.ts
class MetadataManager {
  private metadataDescriptions: Record<string, string> = {}

  addMetadataDescription(key: string, description: string): void {
    this.metadataDescriptions[key] = description
  }

  getMetadataDescriptions(): Record<string, string> {
    return this.metadataDescriptions
  }

  getPromptInjection(): string {
    const metadataDescriptionsString = Object.entries(
      this.getMetadataDescriptions()
    )
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
}

const metadataManager = new MetadataManager()

export { metadataManager }
