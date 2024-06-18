import { relative, join } from 'pathe'
import { globby } from 'globby'
import { Nitro } from 'nitropack/types'

export const GLOB_SCAN_PATTERN = '**/*.{js,mjs,cjs,ts,mts,cts,tsx,jsx}'
type FileInfo = { path: string; fullPath: string }

export async function scanFiles(
  nitro: Nitro,
  name: string
): Promise<FileInfo[]> {
  const files = await Promise.all(
    nitro.options.scanDirs.map(dir => scanDir(nitro, dir, name))
  ).then(r => r.flat())
  return files
}

async function scanDir(
  nitro: Nitro,
  dir: string,
  name: string
): Promise<FileInfo[]> {
  const fileNames = await globby(join(name, GLOB_SCAN_PATTERN), {
    cwd: dir,
    dot: true,
    ignore: nitro.options.ignore,
    absolute: true,
  })
  return (
    fileNames
      // @ts-ignore
      .map(fullPath => {
        return {
          fullPath,
          path: relative(join(dir, name), fullPath),
        }
      })
      .sort((a, b) => a.path.localeCompare(b.path))
  )
}

type NodeHandler = { name: string; handler: string }

export async function getMagickNodes(nitro: Nitro): Promise<NodeHandler[]> {
  const nodeFiles = await scanFiles(nitro, 'nodes')

  console.log('Node files', nodeFiles)

  // @ts-ignore TODO: GLOBAL
  return nodeFiles.map(file => {
    const name = file.path.replace(/.*\/nodes\/(.*)\.(js|ts)/, '$1')
    return { name, handler: file.fullPath }
  })
}
