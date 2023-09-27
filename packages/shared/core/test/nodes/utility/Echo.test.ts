import { runTestSpell } from '../../utils/spellHandler'
import * as echoTest from './Echo.spell.json'
import fs from 'fs'
import path from 'path'

describe('Echo', () => {
  it('should run', async () => {
    const testString = 'test'
    const result = await runTestSpell(echoTest, {
      'Input - Default': {
        content: testString,
      },
    })

    // write the result
    fs.writeFileSync(
      path.join(__dirname, 'Echo.result.json'),
      JSON.stringify(result, null, 2)
    )

    expect(result['Output - Default'] || result['Output']).toBe(testString)
  })
})
