import type { ExecutorContext } from '@nx/devkit'
import { BuildSpecExecutorSchema } from './schema'
import { writeNodeSpecsToFile } from '../../tools/generateNodeSpecs'
import path from 'path'

export default async function runExecutor(
  options: BuildSpecExecutorSchema,
  context: ExecutorContext
) {
  const filePath = path.join(
    context.root,
    options.specFileLocation,
    options.specFileName
  )

  // get the path for a relative fole in ../tools/generateNodeSpec using path

  try {
    writeNodeSpecsToFile(filePath)
    return {
      success: true,
    }
  } catch (err) {
    console.error('Error running script to update node specs')
    console.error(err)
    return {
      success: false,
    }
  }
}
