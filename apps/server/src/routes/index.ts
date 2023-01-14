import { agents } from './agents'
import { events } from './events'
import { generation } from './generation'
import { spells } from './spells'
import { Route } from '../types'

export const routes: Route[] = [...spells, ...agents, ...events, ...generation]
