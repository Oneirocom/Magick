import { runTestSpell } from '../../utils/spellHandler'
import * as echoTest from './Echo.spell.json'

describe('Echo', () => {
  it('should run', async () => {
    const testString = 'test'
    const result = await runTestSpell(echoTest, {
      "Input": {
        "content": testString,
      }
    })
    expect((Object.values(result)[0] as { content: string }).content).toBe(testString)
  })
})