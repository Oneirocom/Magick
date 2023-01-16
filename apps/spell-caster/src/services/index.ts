import { Application } from '../declarations'
import spellRunner from './spell-runner/spell-runner.service'
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(spellRunner)
}
