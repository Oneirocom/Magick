// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('agents', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.boolean('dirty')
    table.string('name')
    table.boolean('enabled')
    table.string('updated_at')
    table.string('projectId')
    table.jsonb('spells')
    table.jsonb('data')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('agents')
}
