import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')

  await knex.schema.createTable('credentials', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
    table.string('projectId').notNullable()
    table.string('name').notNullable()
    table.string('serviceType').notNullable()
    table.enu('credentialType', ['core', 'plugin', 'custom']).notNullable()
    table.enu('authType', ['oauth', 'key']).nullable()
    table.text('value').notNullable()
    table.text('description').nullable()
    table.string('accessToken').nullable()
    table.string('refreshToken').nullable()
    table.timestamp('expiresIn').nullable()
    table.string('scope').nullable()
    table.string('tokenType').nullable()
    table.string('authUrl').nullable()
    table.string('tokenUrl').nullable()
    table.jsonb('metadata').nullable()
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('credentials')
}
