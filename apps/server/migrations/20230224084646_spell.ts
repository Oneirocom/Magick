// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('spells', (table) => {
    table.uuid('id').primary()
    table.string('name')
    table.string('projectId')
    table.string('hash')
    table.jsonb('graph')
    table.string('createdAt')
    table.string('updatedAt')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('spells')
}
