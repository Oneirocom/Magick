interface PrivatePromptModule {
  prompt: string
}

const privatePrompts = ['./private_prompts/seraph_3_cli.ts']

export const importPrivatePrompts = async () => {
  return Promise.all(
    privatePrompts.map(async module => {
      try {
        const imported = (await import(module)) as PrivatePromptModule
        return imported.prompt
      } catch (error) {
        console.error('Failed to import private module:', error)
        return null
      }
    })
  ).then(prompts => {
    return prompts.filter(prompt => prompt !== null).join('\n')
  })
}
