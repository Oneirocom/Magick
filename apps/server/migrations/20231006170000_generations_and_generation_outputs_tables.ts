import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('generations', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
    table.string('projectId').notNullable()
    table.string('model').notNullable()
    table.specificType('paths', 'text ARRAY').nullable()
    table.enum('type', ['image', 'audio', 'video']).notNullable()
    table.timestamp('createdAt').defaultTo(knex.fn.now())
    table.timestamp('deletedAt').nullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('generations')
}
