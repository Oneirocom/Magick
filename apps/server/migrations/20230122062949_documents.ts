// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('documents', (table) => {
    table.uuid('id').primary()
    table.string('type')
    table.string('owner')
    table.string('projectId')
    table.string('content')
    table.specificType('embedding', 'vector(1536)')
    table.string('date')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('documents')
}