import { entities } from './entities'
import { spells } from './spells'
import { wikipedia } from './wikipedia'
import { Route } from '../types'

export const routes: Route[] = [...wikipedia, ...spells, ...entities]
