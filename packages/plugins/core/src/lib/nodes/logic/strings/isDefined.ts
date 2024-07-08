import { makeInNOutFunctionDesc } from '@magickml/behave-graph'

export const IsDefined = makeInNOutFunctionDesc({
  name: 'logic/string/isDefined',
  label: 'Is Defined',
  in: ['string'],
  out: 'boolean',
  exec: (a: string) => a !== undefined && a !== null && a !== '',
})
