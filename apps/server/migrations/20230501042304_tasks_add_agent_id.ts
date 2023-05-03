import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // modify tasks table, add agentId column (text)
  await knex.schema.alterTable('tasks', (table) => {
    table.text('agentId')
  })
}

export async function down(knex: Knex): Promise<void> {
  // remove agentId column from tasks table
  await knex.schema.alterTable('tasks', (table) => {
    table.dropColumn('agentId')
  })
}
