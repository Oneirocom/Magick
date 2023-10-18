import root from './root'

const feathersService = root.injectService<
  'agents',
  ['log', 'results', 'spell']
>({
  name: 'agents',
  events: ['log', 'results', 'spell'],
})

export const { useSelectAgentsLog, useSelectAgentsSpell } =
  feathersService.selectors
