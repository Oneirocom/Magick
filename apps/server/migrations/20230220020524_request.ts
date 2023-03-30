// For more information about this file see https://dove.feathersjs.com/guides/cli/knexfile.html
import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('request', (table) => {
    table.uuid('id').primary()
    table.string('projectId').notNullable()
    table.text('requestData')
    table.text('responseData')
    table.integer('duration').notNullable()
    table.text('status')
    table.integer('statusCode')
    table.string('model')
    table.text('parameters')
    table.timestamp('createdAt').defaultTo(knex.fn.now())
    table.text('provider').notNullable()
    table.text('type').notNullable()
    table.boolean('hidden').notNullable().defaultTo(false)
    table.boolean('processed').notNullable().defaultTo(false),
    table.double('cost')
    table.text('spell')
    table.integer('nodeId')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('request')
}
