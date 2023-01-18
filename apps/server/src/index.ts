import 'regenerator-runtime/runtime'

import { agents } from './agents'
import { events } from './events'
import { apis } from './apis'
import { spells } from './spells'
import { Route } from './types'

export const routes: Route[] = [...spells, ...agents, ...events, ...apis]
