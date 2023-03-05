import { Echo } from '../../../src/lib/nodes/utility/Echo'
import { runTestSpell } from '../../utils/spellHandler'

describe('Echo', () => {
  it('should run', async () => {
    const echo = new Echo()
    const result = await runTestSpell(echo)
    console.info(result)
    expect(result).toBeTruthy()
  })
})