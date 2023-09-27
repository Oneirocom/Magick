import { Application } from '../declarations'

type GetSpell = {
  app: Application
  id: string
  projectId: string
}

export const getSpell = async ({ app, id, projectId }: GetSpell) => {
  const spell = await app.service('spells').find({
    query: {
      projectId,
      id: id,
    },
  })
  return spell.data[0]
}
