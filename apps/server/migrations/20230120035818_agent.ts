// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('agents', (table) => {
    table.uuid('id').primary()
    table.jsonb('rootSpell')
    table.string('publicVariables')
    table.string('secrets')
    table.string('name')
    table.boolean('enabled')
    table.string('updatedAt')
    table.string('projectId')
    table.jsonb('spells')
    table.jsonb('data')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('agents')
}
