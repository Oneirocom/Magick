import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('agent_credentials', (table) => {
    table.uuid('agentId').notNullable()
    table.uuid('credentialId').notNullable()
    table.foreign('agentId').references('id').inTable('agents')
    table.foreign('credentialId').references('id').inTable('credentials')
    table.primary(['agentId', 'credentialId'])
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('agent_credentials')
}
