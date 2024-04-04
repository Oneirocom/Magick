import root from './root'

const seraphEventService = root.injectService<'seraph', ['event']>({
  name: 'seraph',
  events: ['event'],
})

export const { useSelectSeraphEvent } = seraphEventService.selectors
