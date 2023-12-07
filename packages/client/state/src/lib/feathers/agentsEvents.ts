import root from './root'

const feathersService = root.injectService<
  'agents',
  ['log', 'results', 'spell', 'event']
>({
  name: 'agents',
  events: ['log', 'results', 'spell', 'event'],
})

export const {
  useSelectAgentsLog,
  useSelectAgentsSpell,
  useSelectAgentsEvent,
} = feathersService.selectors
