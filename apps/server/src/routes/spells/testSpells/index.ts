import { Spell } from '../types'
import { actionTypeTest } from './actionType'
import { codeTest } from './code'
import { difficultyDetectorTest } from './difficultyDetector'
// import { enkiTaskTest } from './enkiTask'
import { entityDetectorTest } from './entityDetector'
import { generatorTest } from './generator'
// import { huggingfaceTest } from './huggingface'
import { itemDetectorTest } from './itemDetector'
import { proseToScriptTest } from './proseToScript'
import { safetyVerifierTest } from './safetyVerifier'
import { switchGateTest } from './switchGate'
import { tenseTransformerTest } from './tenseTransformer'
import { timeDetectorTest } from './timeDetector'

const testSpells: { [spellName: string]: Spell } = {
  actionType: actionTypeTest,
  code: codeTest,
  difficultyDetector: difficultyDetectorTest,
  // enkiTask: enkiTaskTest,
  entityDetector: entityDetectorTest,
  generator: generatorTest,
  // huggingfaceComponent: huggingfaceTest,
  itemDetector: itemDetectorTest,
  proseToScript: proseToScriptTest,
  safetyVerifier: safetyVerifierTest,
  switchGate: switchGateTest,
  tenseTransformer: tenseTransformerTest,
  timeDetector: timeDetectorTest,
}

export const getTestSpell = (spellName: string) => {
  return {
    graph: testSpells[spellName],
    name: spellName,
    modules: {},
  }
}
