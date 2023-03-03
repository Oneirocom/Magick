// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('request', (table) => {
    table.uuid('id').primary()
    table.string('projectId').notNullable()
    table.string('requestData').notNullable()
    table.string('responseData')
    table.integer('duration').notNullable()
    table.string('status')
    table.integer('statusCode')
    table.string('model')
    table.string('parameters')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.string('provider').notNullable()
    table.string('type').notNullable()
    table.boolean('hidden').notNullable().defaultTo(false)
    table.boolean('processed').notNullable().defaultTo(false),
    table.double('cost')
    table.string('spell')
    table.integer('nodeId')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('request')
}
