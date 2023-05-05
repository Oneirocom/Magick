// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const vectorExtension = await knex.raw('SELECT * FROM pg_extension WHERE extname = \'vector\'')
  if (vectorExtension.rows.length === 0) {
    await knex.raw('CREATE EXTENSION vector')
  }
  await knex.schema.createTable('events', (table) => {
    table.uuid('id').primary()
    table.string('type')
    table.string('observer')
    table.string('sender')
    table.string('client')
    table.string('channel')
    table.string('channelType')
    table.string('projectId')
    table.text('content')
    table.string('agentId')
    table.specificType('entities', 'text ARRAY')
    table.specificType('embedding', 'vector(1536)')
    table.string('date')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('events')
}