import { nodeModule } from '@magickml/nodes'
import { schemasModule } from '@magickml/schemas'
import { spellsModule } from '@magickml/spells'
import { portalModule } from '@magickml/portal'
import { knowledgeModule } from '@magickml/knowledge'

export const modules = [
  nodeModule,
  schemasModule,
  spellsModule,
  portalModule,
  knowledgeModule,
] as const
