import root from './root'

const agentEventService = root.injectService<
  'agents',
  ['log', 'results', 'spell', 'event', 'warn', 'error']
>({
  name: 'agents',
  events: ['log', 'results', 'spell', 'event', 'warn', 'error'],
})

export const {
  useSelectAgentsLog,
  useSelectAgentsSpell,
  useSelectAgentsEvent,
  useSelectAgentsWarn,
  useSelectAgentsError,
} = agentEventService.selectors
