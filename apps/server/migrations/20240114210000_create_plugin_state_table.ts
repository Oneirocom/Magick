import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('pluginState', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
    table.uuid('agentId').references('id').inTable('agents').onDelete('CASCADE')
    table.json('state')
    table.string('plugin')
    table.unique(['agentId', 'plugin'])
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('pluginState')
}
