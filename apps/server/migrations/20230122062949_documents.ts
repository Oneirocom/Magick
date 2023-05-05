// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // check if pg extension "vector" is installed, if not install it
  const vectorExtension = await knex.raw('SELECT * FROM pg_extension WHERE extname = \'vector\'')
  if (vectorExtension.rows.length === 0) {
    await knex.raw('CREATE EXTENSION vector')
  }
  await knex.schema.createTable('documents', (table) => {
    table.uuid('id').primary()
    table.string('type')
    table.string('projectId')
    table.text('content')
    table.specificType('embedding', 'vector(1536)')
    table.string('date')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('documents')
}