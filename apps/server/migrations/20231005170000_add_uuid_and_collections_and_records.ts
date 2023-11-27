import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

  await knex.schema.createTable('collections', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
    table.string('name')
    table.string('projectId').notNullable()
    table.text('description').nullable()
    table.timestamp('createdAt').defaultTo(knex.fn.now())
    table.timestamp('updatedAt').defaultTo(knex.fn.now())
    table.timestamp('deletedAt').nullable()
    table.unique(['name', 'projectId'])
  })

  await knex.schema.createTable('records', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
    table.string('key').notNullable()
    table.string('projectId').notNullable()
    table.uuid('collectionId').references('id').inTable('collections').onDelete('CASCADE').notNullable()
    table.json('data')
    table.json('metadata').nullable()
    table.timestamp('createdAt').defaultTo(knex.fn.now())
    table.timestamp('updatedAt').defaultTo(knex.fn.now())
    table.timestamp('deletedAt').nullable()
    table.unique(['key', 'collectionId'])
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('records')
  await knex.schema.dropTable('collections')
}
