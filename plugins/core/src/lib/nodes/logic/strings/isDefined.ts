import { makeInNOutFunctionDesc } from '@magickml/behave-graph'

export const IsDefined = makeInNOutFunctionDesc({
  name: 'logic/string/isDefined',
  label: 'Concat',
  in: ['string'],
  out: 'boolean',
  exec: (a: string) => a !== undefined && a !== null && a !== '',
})
