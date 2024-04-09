import root from './root'

const agentEventService = root.injectService<
  'agents',
  ['log', 'results', 'spell', 'event', 'warn', 'error', 'seraphEvent']
>({
  name: 'agents',
  events: ['log', 'results', 'spell', 'event', 'warn', 'error', 'seraphEvent'],
})

export const {
  useSelectAgentsLog,
  useSelectAgentsSpell,
  useSelectAgentsEvent,
  useSelectAgentsWarn,
  useSelectAgentsError,
  useSelectAgentsSeraphEvent,
} = agentEventService.selectors
