// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('agents', (table) => {
    table.uuid('id').primary()
    table.jsonb('rootSpell')
    table.text('publicVariables')
    table.text('secrets')
    table.string('name')
    table.boolean('enabled')
    table.string('updatedAt')
    table.string('pingedAt')
    table.string('projectId')
    table.jsonb('data')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('agents')
}
