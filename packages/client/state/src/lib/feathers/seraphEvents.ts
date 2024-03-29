import root from './root'

const seraphEventService = root.injectService<
  'seraph',
  ['request', 'response', 'error', 'info', 'functionStart', 'functionEnd']
>({
  name: 'seraph',
  events: [
    'request',
    'response',
    'error',
    'info',
    'functionStart',
    'functionEnd',
  ],
})

export const {
  useSelectSeraphRequest,
  useSelectSeraphResponse,
  useSelectSeraphError,
  useSelectSeraphInfo,
  useSelectSeraphFunctionStart,
  useSelectSeraphFunctionEnd,
} = seraphEventService.selectors
