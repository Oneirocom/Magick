import { normalize, join } from 'pathe'
import fg from 'fast-glob'
import { readFile } from 'fs/promises'

type ScanJsonFilesOptions = {
  fileFilter?: (file: string) => boolean
  filePatterns?: string[]
  cwd?: string
}

export async function scanJsonFilesFromDir(
  dir: string | string[],
  options?: ScanJsonFilesOptions
): Promise<string[]> {
  const dirs = (Array.isArray(dir) ? dir : [dir]).map(d => normalize(d))
  const fileFilter = options?.fileFilter || (() => true)
  const filePatterns = options?.filePatterns || ['*.spell.json']

  const result = await Promise.all(
    dirs.map(async i => {
      const patterns = [i, ...filePatterns.map(p => join(i, p))]
      return fg(patterns, {
        absolute: true,
        cwd: options?.cwd || process.cwd(),
        onlyFiles: true,
        followSymbolicLinks: true,
      })
    })
  )

  const allFiles = result
    .flat()
    .map(f => normalize(f))
    .sort()

  return Array.from(new Set(allFiles)).filter(fileFilter)
}

export async function readJsonFile(filePath: string): Promise<any> {
  const content = await readFile(filePath, 'utf-8')
  return JSON.parse(content)
}
