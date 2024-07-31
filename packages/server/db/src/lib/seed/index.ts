'@ts-nocheck'
import { PrismaClient } from '../db'

const prisma = new PrismaClient()

const WORLD_ID = '7294d268-6e8e-41be-a179-fd3f7650f9b0'
const AGENT_ID = '623ed862-251a-4c5a-8ba6-773bcf547b01'

async function main() {
  console.log('Seeding agent...')

  const existingSeedAgent = await prisma.agents.findUnique({
    where: {
      id: AGENT_ID,
    },
  })

  if (existingSeedAgent) {
    console.log('Seed Agent already exists, skipping...')
    return
  }

  const agent = await prisma.agents.create({
    data: {
      id: AGENT_ID,
      name: AGENT_ID,
      enabled: true,
      default: false,
      version: '2.0',
      publicVariables: '{}',
      secrets: '{}',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      isDraft: false,
      projectId: WORLD_ID,
      worldId: WORLD_ID,
    },
  })
  console.log('Seed Agent created:', agent.id)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
