import { runTestSpell } from '../../utils/spellHandler'
import * as echoTest from './Template.spell.json'
import fs from 'fs'

describe('Template', () => {
  it('should run', async () => {
    const testString = 'test'
    const result = await runTestSpell(echoTest, {
      'Input - Default': {
        content: testString,
      },
    })
    
    expect(result['Output - Default'] || result['Output']).toBe(testString)
  })
})
