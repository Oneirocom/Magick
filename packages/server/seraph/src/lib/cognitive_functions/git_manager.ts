// git_manager.ts\n
import { exec } from 'child_process'
import { promises as fs } from 'fs'
import { promisify } from 'util'
import { BaseCognitiveFunction } from '../base_cognitive_function'
import { SeraphCore } from '../seraphCore'

const execAsync = promisify(exec)

const functionDefinition = {
  name: 'gitManager',
  description:
    'Generates git diffs for specified files and commits them with a commit message.',
  parameters: {
    filePath: {
      type: 'string',
      description: 'Path to the file for the diff',
    },
    diff: {
      type: 'string',
      description:
        'The git diff for the specified file representing the changes you want applied to the file.',
    },
    commitMessage: {
      type: 'string',
      description: 'Commit message for the git commit',
    },
  },
  examples: [],
}

class GitManager extends BaseCognitiveFunction {
  private seraph: SeraphCore

  constructor(seraph: SeraphCore) {
    super(functionDefinition)
    this.seraph = seraph
  }

  async getPromptInjection(): Promise<string> {
    return '<gitManager_instructions>You can use the gitManager to generate git diffs for specified files and commit them with a commit message. Use this when you want to modify the code for an existing file, or even if you want to use this to add code to a new file and think this would be more helpful than an alternative.  This will return the full updates contents of the file.</gitManager_instructions>'
  }

  async execute(args: Record<string, any>): Promise<string> {
    const { filePath, diff } = args

    try {
      // Write the diff to a temporary file
      const tempDiffFile = `/tmp/seraph-diff-${Date.now()}.diff`
      await fs.writeFile(tempDiffFile, diff)

      // Apply the diff to the specified file
      const { stdout, stderr } = await execAsync(
        `git apply ${tempDiffFile} --ignore-space-change --ignore-whitespace --directory=$(dirname ${filePath})`
      )

      // Delete the temporary diff file
      await fs.unlink(tempDiffFile)

      if (stderr) {
        this.seraph.emit('error', stderr)
        return 'Error applying the diff to the file: ' + stderr
      }

      this.seraph.emit('info', 'Diff applied to the file', {
        filePath,
      })

      return `Diff applied to the file:\n\n${stdout}.\n\nFull changed file contents:\n\n${await fs.readFile(
        filePath,
        'utf-8'
      )}`
    } catch (err: any) {
      this.seraph.emit('error', err)
      return 'Error applying the diff to the file'
    }
  }
}

export { GitManager }
