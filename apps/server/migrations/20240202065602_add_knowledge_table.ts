import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('knowledge', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))

    table.string('name').notNullable()
    table.string('sourceUrl').nullable()
    table.string('dataType').nullable()
    table.string('data').nullable()
    table.string('projectId').notNullable()
    table.json('metadata').nullable()
    table.string('memoryId').nullable()

    // Add createdAt and updatedAt fields
    table.timestamp('createdAt').defaultTo(knex.fn.now())
    table.timestamp('updatedAt').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('knowledge')
}
