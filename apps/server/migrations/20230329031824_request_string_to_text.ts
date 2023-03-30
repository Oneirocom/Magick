import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('request', (table) => {
    table.text('projectId').notNullable().alter()
    table.text('status').alter()
    table.text('model').alter()
    table.text('provider').notNullable().alter()
    table.text('type').notNullable().alter()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('request', (table) => {
    table.string('projectId').notNullable().alter()
    table.string('status').alter()
    table.string('model').alter()
    table.string('provider').notNullable().alter()
    table.string('type').notNullable().alter()
  })
}
