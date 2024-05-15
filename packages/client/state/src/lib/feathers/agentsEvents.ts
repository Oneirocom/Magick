import root from './root'

const agentEventService = root.injectService<
  'agents',
  ['log', 'results', 'spell', 'event', 'warn', 'error', 'seraphEvent', 'state']
>({
  name: 'agents',
  events: [
    'log',
    'results',
    'spell',
    'event',
    'warn',
    'error',
    'seraphEvent',
    'state',
  ],
})

export const {
  useSelectAgentsLog,
  useSelectAgentsSpell,
  useSelectAgentsEvent,
  useSelectAgentsWarn,
  useSelectAgentsError,
  useSelectAgentsSeraphEvent,
  useSelectAgentsState,
} = agentEventService.selectors
