import { agents } from './agents'
import { events } from './events'
import { generation } from './generation'
import { spells } from './spells'
import { wikipedia } from './wikipedia'
import { Route } from '../types'

export const routes: Route[] = [...wikipedia, ...spells, ...agents, ...events, ...generation]
