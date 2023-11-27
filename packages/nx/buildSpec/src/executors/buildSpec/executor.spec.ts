import { BuildSpecExecutorSchema } from './schema'
import executor from './executor'

const options: BuildSpecExecutorSchema = {
  specFileLocation: 'test',
  specFileName: 'test',
}

describe('BuildSpec Executor', () => {
  it('can run', async () => {
    // @ts-ignore
    const output = await executor(options)
    expect(output.success).toBe(true)
  })
})
