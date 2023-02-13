// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('events', (table) => {
    table.increments('id')
    table.string('type')
    table.string('observer')
    table.string('sender')
    table.json('entities')
    table.string('client')
    table.string('channel')
    table.string('channelType')
    table.string('content')
    table.integer('agentId')
    table.string('date')
  })
  // alter table events add column embedding vector
  await knex.schema.alterTable('events', (table) => {
    table.specificType('embedding', 'vector(1536)')
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('events')
}